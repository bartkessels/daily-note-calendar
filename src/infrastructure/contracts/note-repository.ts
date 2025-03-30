import {Note} from 'src/domain/models/note.model';

export interface NoteRepository {
    getActiveNote(): Promise<Note | null>;
    getNotes(filter: (note: Note) => boolean): Promise<Note[]>;
}