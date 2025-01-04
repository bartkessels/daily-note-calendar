import { createNoteUiModel, NoteUiModel } from 'src/components/models/note.ui-model';
import { Note } from 'src/domain/models/note';
import 'src/extensions/extensions';

describe('createNoteUiModel', () => {
    it('should create a NoteUiModel with the correct properties', () => {
        const note: Note = {
            path: 'path/to/note.md',
            name: 'note.md',
            createdOn: new Date('2023-10-01T00:00:00Z'),
            properties: new Map()
        };

        const noteUiModel: NoteUiModel = createNoteUiModel(note);

        expect(noteUiModel.note).toBe(note);
        expect(noteUiModel.displayDate).toBe(note.createdOn.toLocaleTimeString());
        expect(noteUiModel.displayName).toBe('note');
        expect(noteUiModel.displayFilePath).toBe(note.path);
    });

    it('should remove the markdown extension from the displayName', () => {
        const note: Note = {
            path: 'path/to/note.md',
            name: 'note.md',
            createdOn: new Date('2023-10-01T00:00:00Z'),
            properties: new Map()
        };

        const noteUiModel: NoteUiModel = createNoteUiModel(note);

        expect(noteUiModel.displayName).toBe('note');
    });

    it('should format the displayDate correctly', () => {
        const note: Note = {
            path: 'path/to/note.md',
            name: 'note.md',
            createdOn: new Date(2023, 9, 2, 12, 23),
            properties: new Map()
        };

        const noteUiModel: NoteUiModel = createNoteUiModel(note);

        expect(noteUiModel.displayDate).toBe('12:23:00 PM');
    });
});