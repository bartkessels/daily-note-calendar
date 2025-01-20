import {Note} from 'src/domain/models/note';

export interface NotesRepository {
    get(filter: (note: Note) => boolean): Promise<Note[]>;
}