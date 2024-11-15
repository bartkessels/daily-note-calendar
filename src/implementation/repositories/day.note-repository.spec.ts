import { DayNoteRepository } from './day.note-repository';
import { NoteAdapter } from 'src/domain/adapters/note.adapter';
import { Day } from 'src/domain/models/day';
import { Note } from 'src/domain/models/note';

describe('DayNoteRepository', () => {
    let mockNoteAdapter: NoteAdapter;
    let repository: DayNoteRepository;

    beforeEach(() => {
        mockNoteAdapter = {
            getNotesCreatedOn: jest.fn(),
        };
        repository = new DayNoteRepository(mockNoteAdapter);
    });

    it('should call getNotesCreatedOn on the note adapter with the correct date', async () => {
        const day: Day = { dayOfWeek: 1, date: 2, completeDate: new Date(2023, 9, 2), name: '2' };
        const notes: Note[] = [
            { name: 'Note 1', createdOn: new Date(2023, 9, 2, 10), path: 'path/to/note1' },
            { name: 'Note 2', createdOn: new Date(2023, 9, 2, 11), path: 'path/to/note2' },
        ];

        (mockNoteAdapter.getNotesCreatedOn as jest.Mock).mockResolvedValueOnce(notes);

        const result = await repository.getNotesCreatedOn(day);

        expect(mockNoteAdapter.getNotesCreatedOn).toHaveBeenCalledWith(day.completeDate);
        expect(result).toEqual(notes);
    });

    it('should return an empty array when no notes are found', async () => {
        const day: Day = { dayOfWeek: 1, date: 2, completeDate: new Date(2023, 9, 2), name: '2' };

        (mockNoteAdapter.getNotesCreatedOn as jest.Mock).mockResolvedValueOnce([]);

        const result = await repository.getNotesCreatedOn(day);

        expect(mockNoteAdapter.getNotesCreatedOn).toHaveBeenCalledWith(day.completeDate);
        expect(result).toEqual([]);
    });
});