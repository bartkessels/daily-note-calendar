import {Note} from 'src-old/domain/models/note';

export interface NoteRepository<T> {
    getNotesCreatedOn(date: T): Promise<Note[]>;
}