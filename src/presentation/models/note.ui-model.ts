import {Note} from 'src/domain/models/note.model';

export interface NoteUiModel {
    note: Note;
    date: string;
    name: string;
    filePath: string;
}
