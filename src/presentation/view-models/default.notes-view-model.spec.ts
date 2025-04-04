import { mockNoteManager } from "src/test-helpers/manager.mocks";
import {DefaultNotesViewModel} from 'src/presentation/view-models/default.notes-view-model';
import {mockNoteManagerFactory} from 'src/test-helpers/factory.mocks';
import {Period, PeriodType} from 'src/domain/models/period.model';
import {Note} from 'src/domain/models/note.model';
import {when} from 'jest-when';

describe('NotesViewModel', () => {
    const noteManager = mockNoteManager;
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
        const noteManagerFactory = mockNoteManagerFactory(noteManager);

        viewModel = new DefaultNotesViewModel(noteManagerFactory);
    })

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('loadNotes', () => {
        it('should call the noteManager and return the result', async () => {
            // Arrange
            const expectedNotes = [note];
            when(noteManager.getNotesForPeriod).mockReturnValue(expectedNotes);

            // Act
            const result = await viewModel.loadNotes(period);

            // Assert
            expect(result).toEqual(expectedNotes);
            expect(noteManager.getNotesForPeriod).toHaveBeenCalledWith(period);
        });
    });

    describe('openNoteInHorizontalSplitView', () => {
        it('should call the noteManager', async () => {
            // Act
            await viewModel.openNoteInHorizontalSplitView(note);

            // Assert
            expect(noteManager.openNoteInHorizontalSplitView).toHaveBeenCalledWith(note);
        });
    });

    describe('openNoteInVerticalSplitView', () => {
        it('should call the noteManager', async () => {
            // Act
            await viewModel.openNoteInVerticalSplitView(note);

            // Assert
            expect(noteManager.openNoteInVerticalSplitView).toHaveBeenCalledWith(note);
        });
    });

    describe('openNote', () => {
        it('should call the noteManager', async () => {
            // Act
            await viewModel.openNote(note);

            // Assert
            expect(noteManager.openNote).toHaveBeenCalledWith(note);
        });
    });

    describe('deleteNote', () => {
        it('should call the noteManager', async () => {
            // Act
            await viewModel.deleteNote(note);

            // Assert
            expect(noteManager.deleteNote).toHaveBeenCalledWith(note);
        });
    });
});