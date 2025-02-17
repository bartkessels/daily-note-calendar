import {AdapterNoteRepository} from 'src/infrastructure/repositories/adapter.note-repository';
import {mockNoteAdapter} from 'src/test-helpers/adapter.mocks';
import {mockNoteWithCreatedOnProperty} from 'src/test-helpers/model.mocks';

describe('AdapterNoteRepository', () => {
    let repository: AdapterNoteRepository;
    const noteAdapter = mockNoteAdapter;

    beforeEach(() => {
        repository = new AdapterNoteRepository(noteAdapter);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('getActiveNote', () => {
        it('should return the active note when the adapter returns it', async () => {
            // Arrange
            const note = mockNoteWithCreatedOnProperty;
            noteAdapter.getActiveNote.mockResolvedValue(note);

            // Act
            const result = await repository.getActiveNote();

            // Assert
            expect(result).toBe(note);
        });

        it('should return null when the adapter returns null', async () => {
            // Arrange
            noteAdapter.getActiveNote.mockResolvedValue(null);

            // Act
            const result = await repository.getActiveNote();

            // Assert
            expect(result).toBeNull();
        });
    });
});