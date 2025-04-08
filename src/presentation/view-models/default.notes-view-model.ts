import {Note} from 'src/domain/models/note.model';
import {Period} from 'src/domain/models/period.model';
import {NotesViewModel} from 'src/presentation/contracts/notes.view-model';
import {NoteService} from 'src/presentation/contracts/note-service';

export class DefaultNotesViewModel implements NotesViewModel {
    public updateNotes?: () => void;

    constructor(
        private readonly noteService: NoteService
    ) {

    }

    public initializeCallbacks(updateNotes: () => void): void {
        this.updateNotes = updateNotes;
    }

    public async loadNotes(period: Period): Promise<Note[]> {
        return await this.noteService.getNotesForPeriod(period);
    }

    public async openNoteInHorizontalSplitView(note: Note): Promise<void> {
        await this.noteService.openNoteInHorizontalSplitView(note);
    }

    public async openNoteInVerticalSplitView(note: Note): Promise<void> {
        await this.noteService.openNoteInVerticalSplitView(note);
    }

    public async openNote(note: Note): Promise<void> {
        await this.noteService.openNote(note);
    }

    public async deleteNote(note: Note): Promise<void> {
        await this.noteService.deleteNote(note);
    }
}