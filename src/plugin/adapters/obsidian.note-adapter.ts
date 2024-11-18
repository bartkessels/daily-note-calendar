import {NoteAdapter} from 'src/domain/adapters/note.adapter';
import {Note} from 'src/domain/models/note';
import {App} from 'obsidian';

export class ObsidianNoteAdapter implements NoteAdapter {
    constructor(
        private readonly app: App
    ) {

    }

    public async getNotesCreatedOn(date: Date): Promise<Note[]> {
        const files = this.app.vault.getMarkdownFiles()
            .filter((file) => {
                const createdDate = new Date(file.stat.ctime);
                return createdDate.toLocaleDateString() === date.toLocaleDateString();
            });

        return files.map((file) => <Note>{
           path: file.path,
           name: file.name,
           createdOn: new Date(file.stat.ctime)
        });
    }
}