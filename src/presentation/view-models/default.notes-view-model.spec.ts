import {DefaultNotesViewModel} from 'src/presentation/view-models/default.notes-view-model';
import {Period, PeriodType} from 'src/domain/models/period.model';
import {Note} from 'src/domain/models/note.model';
import {when} from 'jest-when';
import {mockNoteService} from 'src/test-helpers/service.mocks';

describe('NotesViewModel', () => {
    const noteService = mockNoteService;
    const period = <Period> {
        date: new Date(2023, 9, 2),
        name: '02',
        type: PeriodType.Day
    };
    const note = <Note> {
        createdOn: period,
        createdOnProperty: null,
        name: 'My own note',
        path: 'path/to/note',
        properties: new Map()
    };

    let viewModel: DefaultNotesViewModel;

    beforeEach(() => {
        viewModel = new DefaultNotesViewModel(noteService);
    })

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('loadNotes', () => {
        it('should call the noteService and return the result', async () => {
            // Arrange
            const expectedNotes = [note];
            when(noteService.getNotesForPeriod).mockResolvedValue(expectedNotes);

            // Act
            const result = await viewModel.loadNotes(period);

            // Assert
            expect(result).toEqual(expectedNotes);
            expect(noteService.getNotesForPeriod).toHaveBeenCalledWith(period);
        });
    });

    describe('openNoteInHorizontalSplitView', () => {
        it('should call the noteService', async () => {
            // Act
            await viewModel.openNoteInHorizontalSplitView(note);

            // Assert
            expect(noteService.openNoteInHorizontalSplitView).toHaveBeenCalledWith(note);
        });
    });

    describe('openNoteInVerticalSplitView', () => {
        it('should call the noteService', async () => {
            // Act
            await viewModel.openNoteInVerticalSplitView(note);

            // Assert
            expect(noteService.openNoteInVerticalSplitView).toHaveBeenCalledWith(note);
        });
    });

    describe('openNote', () => {
        it('should call the noteService', async () => {
            // Act
            await viewModel.openNote(note);

            // Assert
            expect(noteService.openNote).toHaveBeenCalledWith(note);
        });
    });

    describe('deleteNote', () => {
        it('should call the noteService', async () => {
            // Act
            await viewModel.deleteNote(note);

            // Assert
            expect(noteService.deleteNote).toHaveBeenCalledWith(note);
        });
    });
});