import {Note} from 'src-new/domain/models/note.model';

export interface NoteManager {
    openNote(note: Note): Promise<void>;
    deleteNote(note: Note): Promise<void>;
}