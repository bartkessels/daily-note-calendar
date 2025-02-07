import {Note} from 'src/domain/models/note.model';

export interface NoteManager {
    getActiveNote(): Promise<Note | null>;
    openNote(note: Note): Promise<void>;
    deleteNote(note: Note): Promise<void>;
}