import {Note} from 'src/domain/models/note.model';
import {NoteAdapter} from 'src/infrastructure/adapters/note.adapter';
import {Plugin, TFile} from 'obsidian';
import {DateRepository} from 'src/infrastructure/contracts/date-repository';
import {DateRepositoryFactory} from 'src/infrastructure/contracts/date-repository-factory';

export class ObsidianNoteAdapter implements NoteAdapter {
    private readonly dateRepository: DateRepository;

    constructor(
        private readonly plugin: Plugin,
        dateRepositoryFactory: DateRepositoryFactory
    ) {
        this.dateRepository = dateRepositoryFactory.getRepository();
    }

    public async getActiveNote(): Promise<Note | null> {
        const activeFile = this.plugin.app.workspace.getActiveFile();

        if (!activeFile) {
            return null;
        }

        return await this.asNote(activeFile);
    }

    public async getNotes(filter: (note: Note) => boolean): Promise<Note[]> {
        const notes = await Promise.all(this.plugin.app.vault.getMarkdownFiles().map((file: TFile) =>
            this.asNote(file)
        ));
        return notes.filter(note => filter(note));
    }

    private async asNote(file: TFile): Promise<Note> {
        let frontMatter: Map<string, string> = new Map<string, string>();

        try {
            await this.plugin.app.fileManager.processFrontMatter(file, (data): void => {
                frontMatter = new Map<string, string>(Object.entries(data));
            }, {
                // The ctime property is otherwise changed to the current datetime when the front matter is processed.
                // Because of this, we need to set it back to the original value.
                ctime: file.stat.ctime,
                mtime: file.stat.mtime
            });
        } catch (e) {
            console.error(`Error processing front matter for file: ${file.path}. Error: ${e}`);
        }

        const createdOn = this.dateRepository.getDayFromDate(new Date(file.stat.ctime));

        return <Note>{
            path: file.path,
            name: file.name.removeMarkdownExtension(),
            createdOn: createdOn,
            properties: frontMatter
        };
    }
}