import { Note } from 'src/domain/models/note.model';
import {NoteRepository} from 'src/infrastructure/contracts/note-repository';
import {NoteAdapter} from 'src/infrastructure/adapters/note.adapter';

export class AdapterNoteRepository implements NoteRepository {
    constructor(
        private readonly adapter: NoteAdapter
    ) {

    }

    public async getActiveNote(): Promise<Note | null> {
        return await this.adapter.getActiveNote();
    }

    public async getNotes(filter: (note: Note) => boolean): Promise<Note[]> {
        const notes = await this.adapter.getNotes();
        return notes.filter(filter);
    }
}