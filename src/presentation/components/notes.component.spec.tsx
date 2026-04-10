import React, {ReactNode} from 'react';
import {render, act, screen} from '@testing-library/react';
import {NotesComponent} from 'src/presentation/components/notes.component';
import {ViewModelsContext} from 'src/presentation/context/view-model.context';
import {ViewModelsContext as ViewModelsContextType} from 'src/presentation/context/view-model.context';
import {mockCalendarViewModel, mockDayNoteViewModel, mockPeriodNoteViewModel, mockNotesViewModel} from 'src/test-helpers/view-model.mocks';
import {mockPeriod, mockNoteWithCreatedOnProperty} from 'src/test-helpers/model.mocks';
import {Period, PeriodType} from 'src/domain/models/period.model';
import {Note} from 'src/domain/models/note.model';

describe('NotesComponent', () => {
    const period = mockPeriod;

    const mockContext: ViewModelsContextType = {
        calendarViewModel: mockCalendarViewModel,
        dailyNoteViewModel: mockDayNoteViewModel,
        weeklyNoteViewModel: {...mockPeriodNoteViewModel},
        monthlyNoteViewModel: {...mockPeriodNoteViewModel},
        quarterlyNoteViewModel: {...mockPeriodNoteViewModel},
        yearlyNoteViewModel: {...mockPeriodNoteViewModel},
        notesViewModel: mockNotesViewModel,
    };

    const wrapper = ({children}: {children: ReactNode}) => (
        <ViewModelsContext.Provider value={mockContext}>
            {children}
        </ViewModelsContext.Provider>
    );

    beforeEach(() => {
        jest.clearAllMocks();
        mockNotesViewModel.loadNotes.mockResolvedValue([]);
    });

    it('calls loadNotes on initial render and renders returned notes', async () => {
        // Arrange
        const note: Note = mockNoteWithCreatedOnProperty;
        mockNotesViewModel.loadNotes.mockResolvedValue([note]);

        // Act
        await act(async () => {
            render(<NotesComponent period={period} />, {wrapper});
        });

        // Assert
        expect(mockNotesViewModel.loadNotes).toHaveBeenCalledWith(period);
        expect(screen.getByText(note.name)).toBeTruthy();
    });

    it('clears notes when period becomes null', async () => {
        // Arrange
        const note: Note = mockNoteWithCreatedOnProperty;
        mockNotesViewModel.loadNotes.mockResolvedValue([note]);

        let rerender: (ui: React.ReactElement) => void;

        await act(async () => {
            const result = render(<NotesComponent period={period} />, {wrapper});
            rerender = result.rerender;
        });

        // Confirm notes are populated
        expect(screen.getByText(note.name)).toBeTruthy();

        // Act — change period to null
        await act(async () => {
            rerender!(
                <ViewModelsContext.Provider value={mockContext}>
                    <NotesComponent period={null} />
                </ViewModelsContext.Provider>,
            );
        });

        // Assert — note should no longer be rendered
        expect(screen.queryByText(note.name)).toBeNull();
    });

    it('calls initializeCallbacks with a function after render with a non-null period', async () => {
        // Act
        await act(async () => {
            render(<NotesComponent period={period} />, {wrapper});
        });

        // Assert
        expect(mockNotesViewModel.initializeCallbacks).toHaveBeenCalledWith(expect.any(Function));
    });

    it('re-triggers loadNotes via the registered callback with the current period', async () => {
        // Arrange
        const updatedNote: Note = {
            ...mockNoteWithCreatedOnProperty,
            name: 'New vault note',
            path: 'notes/new-vault-note.md',
        };

        mockNotesViewModel.loadNotes.mockResolvedValue([]);

        await act(async () => {
            render(<NotesComponent period={period} />, {wrapper});
        });

        // Capture the registered callback
        const registeredCallback: () => void = mockNotesViewModel.initializeCallbacks.mock.calls[
            mockNotesViewModel.initializeCallbacks.mock.calls.length - 1
        ][0];

        mockNotesViewModel.loadNotes.mockResolvedValue([updatedNote]);

        // Act — simulate vault create event triggering the callback
        await act(async () => {
            registeredCallback();
        });

        // Assert
        expect(mockNotesViewModel.loadNotes).toHaveBeenCalledWith(period);
        expect(screen.getByText(updatedNote.name)).toBeTruthy();
    });

    it('calls loadNotes with the new period when period changes', async () => {
        // Arrange
        const updatedPeriod: Period = {
            date: new Date(2023, 9, 10),
            name: '10',
            type: PeriodType.Day,
        };

        let rerender: (ui: React.ReactElement) => void;

        await act(async () => {
            const result = render(<NotesComponent period={period} />, {wrapper});
            rerender = result.rerender;
        });

        jest.clearAllMocks();
        mockNotesViewModel.loadNotes.mockResolvedValue([]);

        // Act
        await act(async () => {
            rerender!(
                <ViewModelsContext.Provider value={mockContext}>
                    <NotesComponent period={updatedPeriod} />
                </ViewModelsContext.Provider>,
            );
        });

        // Assert
        expect(mockNotesViewModel.loadNotes).toHaveBeenCalledWith(updatedPeriod);
    });
});
