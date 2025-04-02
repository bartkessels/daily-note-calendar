import {Note} from 'src/domain/models/note.model';
import {NoteManagerFactory} from 'src/business/contracts/note-manager-factory';
import {Period} from 'src/domain/models/period.model';

export interface NotesViewModel {
    loadNotes(period: Period): Promise<Note[]>;
    openNote(note: Note): Promise<void>
    deleteNote(note: Note): Promise<void>;
}

export class DefaultNotesViewModel implements NotesViewModel {
    constructor(
        private readonly noteManagerFactory: NoteManagerFactory,
    ) {

    }

    public async loadNotes(period: Period): Promise<Note[]> {
        return await this.noteManagerFactory.getManager().getNotesForPeriod(period);
    }

    public async openNote(note: Note): Promise<void> {
        await this.noteManagerFactory.getManager().openNote(note);
    }

    public async deleteNote(note: Note): Promise<void> {
        await this.noteManagerFactory.getManager().deleteNote(note);
    }
}