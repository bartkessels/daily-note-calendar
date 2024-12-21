import {Note} from 'src/domain/models/note';

export interface NoteUiModel {
    note: Note;
    displayDate: string;
    displayName: string;
    displayFilePath: string;
}

export function createNoteUiModel(note: Note): NoteUiModel {
    return <NoteUiModel>{
        note: note,
        displayDate: note.createdOn.toLocaleTimeString(),
        displayName: note.name.removeMarkdownExtension(),
        displayFilePath: note.path
    };
}