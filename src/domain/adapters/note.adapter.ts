import {Note} from 'src/domain/models/note';

export interface NoteAdapter {
    getNotesCreatedOn(date: Date): Promise<Note[]>;
    getNotesWithCreatedOnProperty(date: Date, propertyName: string): Promise<Note[]>;
    getActiveNote(): Promise<Note | null>;
}