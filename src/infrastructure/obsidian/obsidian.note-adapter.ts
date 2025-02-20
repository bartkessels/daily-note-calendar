import {Note} from 'src/domain/models/note.model';
import {NoteAdapter} from 'src/infrastructure/adapters/note.adapter';
import {Plugin, TFile} from 'obsidian';
import {DateRepositoryFactory} from 'src/infrastructure/contracts/date-repository-factory';

export class ObsidianNoteAdapter implements NoteAdapter {
    constructor(
        private readonly plugin: Plugin,
        private readonly dateRepositoryFactory: DateRepositoryFactory
    ) {

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
        const createdOn = this.dateRepositoryFactory.getRepository().getDayFromDate(new Date(file.stat.ctime));
        const frontMatter = this.readFrontMatter(file);

        return <Note>{
            path: file.path,
            name: file.name.removeMarkdownExtension(),
            createdOn: createdOn,
            properties: frontMatter
        };
    }

    private readFrontMatter(file: TFile): Map<string, string> {
        let frontMatter: Map<string, string> = new Map<string, string>();

        try {
            const frontMatterCache = this.plugin.app.metadataCache.getFileCache(file)?.frontmatter;
            if (frontMatterCache) {
                frontMatter = new Map<string, string>(Object.entries(frontMatterCache));
            }
        } catch (e) {
            console.error(`Error processing front matter for file: ${file.path}. Error: ${e}`);
        }

        return frontMatter;
    }
}