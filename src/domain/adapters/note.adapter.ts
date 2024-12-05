import {Note} from 'src/domain/models/note';

export interface NoteAdapter {
    getNotesCreatedOn(date: Date): Promise<Note[]>;
    getActiveNote(): Promise<Note | null>;
}