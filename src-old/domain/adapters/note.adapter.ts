import {Note} from 'src-old/domain/models/note';

export interface NoteAdapter {
    getNotes(filter: (note: Note) => boolean): Promise<Note[]>;
    getActiveNote(): Promise<Note | null>;
}