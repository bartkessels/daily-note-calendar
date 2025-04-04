import {Note} from 'src/domain/models/note.model';
import {NoteManagerFactory} from 'src/business/contracts/note-manager-factory';
import {Period} from 'src/domain/models/period.model';
import {NotesViewModel} from 'src/presentation/contracts/notes.view-model';

export class DefaultNotesViewModel implements NotesViewModel {
    constructor(
        private readonly noteManagerFactory: NoteManagerFactory,
    ) {

    }

    public async loadNotes(period: Period): Promise<Note[]> {
        return await this.noteManagerFactory.getManager().getNotesForPeriod(period);
    }

    public async openNoteInHorizontalSplitView(note: Note): Promise<void> {
        await this.noteManagerFactory.getManager().openNoteInHorizontalSplitView(note);
    }

    public async openNoteInVerticalSplitView(note: Note): Promise<void> {
        await this.noteManagerFactory.getManager().openNoteInVerticalSplitView(note);
    }

    public async openNote(note: Note): Promise<void> {
        await this.noteManagerFactory.getManager().openNote(note);
    }

    public async deleteNote(note: Note): Promise<void> {
        await this.noteManagerFactory.getManager().deleteNote(note);
    }
}