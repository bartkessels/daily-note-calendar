import {NoteUiModel} from 'src/presentation/models/note.ui-model';

export interface NotesUiModel {
    lastUpdated: Date;
    notes: NoteUiModel[];
}