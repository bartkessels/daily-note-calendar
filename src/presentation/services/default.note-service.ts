import {NoteService} from 'src/presentation/contracts/note-service';
import {NoteManagerFactory} from 'src/business/contracts/note-manager-factory';
import { Note } from 'src/domain/models/note.model';
import { Period } from 'src/domain/models/period.model';

export class DefaultNoteService implements NoteService {
    constructor(
        private readonly noteManagerFactory: NoteManagerFactory
    ) {

    }

    public async getNotesForPeriod(period: Period): Promise<Note[]> {
        return await this.noteManagerFactory.getManager().getNotesForPeriod(period);
    }

    public async openNote(note: Note): Promise<void> {
        await this.noteManagerFactory.getManager().openNote(note);
    }

    public async openNoteInHorizontalSplitView(note: Note): Promise<void> {
        await this.noteManagerFactory.getManager().openNoteInHorizontalSplitView(note);
    }

    public async openNoteInVerticalSplitView(note: Note): Promise<void> {
        await this.noteManagerFactory.getManager().openNoteInVerticalSplitView(note);
    }

    public async deleteNote(note: Note): Promise<void> {
        await this.noteManagerFactory.getManager().deleteNote(note);
    }
}