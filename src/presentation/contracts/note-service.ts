import { Note } from "src/domain/models/note.model";
import {Period} from 'src/domain/models/period.model';

export interface NoteService {
    getNotesForPeriod(period: Period): Promise<Note[]>;
    openNote(note: Note): Promise<void>;
    openNoteInHorizontalSplitView(note: Note): Promise<void>;
    openNoteInVerticalSplitView(note: Note): Promise<void>;
    deleteNote(note: Note): Promise<void>;
}