import {Note} from 'src/domain/models/note';

export interface NoteRepository<T> {
    getNotesCreatedOn(date: T): Promise<Note[]>;
}