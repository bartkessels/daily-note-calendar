import {NoteAdapter} from 'src/domain/adapters/note.adapter';
import {Note} from 'src/domain/models/note';
import {App, getFrontMatterInfo} from 'obsidian';
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

        return <Note> {
            path: activeFile.path,
            name: activeFile.name.removeMarkdownExtension(),
            createdOn: new Date(activeFile.stat.ctime)
        };
    }

    public async getNotesCreatedOn(date: Date): Promise<Note[]> {
        const files = this.app.vault.getMarkdownFiles()
            .filter((file) => {
                const createdDate = new Date(file.stat.ctime);
                return createdDate.toLocaleDateString() === date.toLocaleDateString();
            });

        return files.map((file) => <Note>{
           path: file.path,
           name: file.name.removeMarkdownExtension(),
           createdOn: new Date(file.stat.ctime)
        });
    }
}