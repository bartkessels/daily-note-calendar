import {NoteAdapter} from 'src/domain/adapters/note.adapter';
import {Note} from 'src/domain/models/note';
import {App, TFile} from 'obsidian';
import 'src/extensions/extensions';

export class ObsidianNoteAdapter implements NoteAdapter {
    constructor(
        private readonly app: App
    ) {

    }

    public async getActiveNote(): Promise<Note | null> {
        const activeFile = this.app.workspace.getActiveFile();

        if (!activeFile) {
            return null;
        }

        return this.asNote(activeFile);
    }

    public async getNotes(filter: (note: Note) => boolean): Promise<Note[]> {
        const notes = await Promise.all(this.app.vault.getMarkdownFiles().map((file: TFile) =>
            this.asNote(file)
        ));
        return notes.filter(note => filter(note));
    }

    private async asNote(file: TFile): Promise<Note> {
        let frontMatter: Map<string, string> = new Map<string, string>();

        try {
            await this.app.fileManager.processFrontMatter(file, (data): void => {
                frontMatter = new Map<string, string>(Object.entries(data));
            });
        } catch (e) {
            console.error(`Error processing front matter for file: ${file.path}. Error: ${e}`);
        }

        return <Note>{
            path: file.path,
            name: file.name.removeMarkdownExtension(),
            createdOn: new Date(file.stat.ctime),
            properties: frontMatter
        };
    }
}