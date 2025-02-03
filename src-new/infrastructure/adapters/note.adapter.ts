import {Note} from 'src-new/domain/models/note.model';

export interface NoteAdapter {
    getNotes(filter: (note: Note) => boolean): Promise<Note[]>;
}