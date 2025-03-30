import {Note} from 'src/domain/models/note.model';

export interface NoteAdapter {
    getActiveNote(): Promise<Note | null>;
    getNotes(): Promise<Note[]>;
}