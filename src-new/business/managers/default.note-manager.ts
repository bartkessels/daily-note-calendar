import {NoteManager} from 'src-new/business/contracts/note.manager';
import { Note } from 'src-new/domain/models/note.model';
import {FileAdapter} from 'src-new/infrastructure/adapters/file.adapter';

export class DefaultNoteManager implements NoteManager {
    constructor(
        private readonly fileAdapter: FileAdapter
    ) {

    }

    public async openNote(note: Note): Promise<void> {
        await this.fileAdapter.open(note.path);
    }

    public async deleteNote(note: Note): Promise<void> {
        await this.fileAdapter.delete(note.path);
    }
}