import {Note} from 'src/domain/models/note.model';
import {Period} from 'src/domain/models/period.model';

export interface NoteManager {
    getActiveNote(): Promise<Note | null>;
    getNotesForPeriod(period: Period): Promise<Note[]>;
    openNote(note: Note): Promise<void>;
    deleteNote(note: Note): Promise<void>;
}