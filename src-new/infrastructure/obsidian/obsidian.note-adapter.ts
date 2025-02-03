import { Note } from 'src-new/domain/models/note.model';
import {NoteAdapter} from 'src-new/infrastructure/adapters/note.adapter';
import {Plugin, TFile} from 'obsidian';

export class ObsidianNoteAdapter implements NoteAdapter {
    constructor(
        private readonly plugin: Plugin
    ) {

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