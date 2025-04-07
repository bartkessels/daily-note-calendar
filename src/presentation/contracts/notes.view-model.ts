import {Period} from 'src/domain/models/period.model';
import {Note} from 'src/domain/models/note.model';

export interface NotesViewModel {
    loadNotes(period: Period): Promise<Note[]>;
    openNoteInHorizontalSplitView(note: Note): Promise<void>
    openNoteInVerticalSplitView(note: Note): Promise<void>
    openNote(note: Note): Promise<void>
    deleteNote(note: Note): Promise<void>;
}
