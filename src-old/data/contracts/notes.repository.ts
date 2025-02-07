import {Note} from 'src-old/domain/models/note';

export interface NotesRepository {
    get(filter: (note: Note) => boolean): Promise<Note[]>;
}