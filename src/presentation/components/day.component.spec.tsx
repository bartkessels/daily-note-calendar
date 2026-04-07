import React, {ReactNode} from 'react';
import {render, act} from '@testing-library/react';
import {DailyNoteComponent} from 'src/presentation/components/day.component';
import {ViewModelsContext} from 'src/presentation/context/view-model.context';
import {mockDayNoteViewModel, mockPeriodNoteViewModel, mockCalendarViewModel, mockNotesViewModel} from 'src/test-helpers/view-model.mocks';
import {mockPeriod} from 'src/test-helpers/model.mocks';
import {Period} from 'src/domain/models/period.model';
import {ViewModelsContext as ViewModelsContextType} from 'src/presentation/context/view-model.context';

describe('DailyNoteComponent', () => {
    const day = mockPeriod;
    const onSelect = jest.fn();

    const mockContext: ViewModelsContextType = {
        calendarViewModel: mockCalendarViewModel,
        dailyNoteViewModel: mockDayNoteViewModel,
        weeklyNoteViewModel: {...mockPeriodNoteViewModel},
        monthlyNoteViewModel: {...mockPeriodNoteViewModel},
        quarterlyNoteViewModel: {...mockPeriodNoteViewModel},
        yearlyNoteViewModel: {...mockPeriodNoteViewModel},
        notesViewModel: mockNotesViewModel
    };

    const wrapper = ({children}: {children: ReactNode}) => (
        <ViewModelsContext.Provider value={mockContext}>
            {children}
        </ViewModelsContext.Provider>
    );

    beforeEach(() => {
        jest.clearAllMocks();
        mockDayNoteViewModel.hasPeriodicNote.mockResolvedValue(false);
        mockDayNoteViewModel.getNoteCount.mockResolvedValue(0);
    });

    it('initializes noteCount to 0', () => {
        // Arrange
        mockDayNoteViewModel.getNoteCount.mockResolvedValue(0);

        // Act
        const {container} = render(
            <DailyNoteComponent
                day={day}
                today={null}
                selectedPeriod={null}
                isSameMonth={true}
                noteCountToken={0}
                onSelect={onSelect}
            />,
            {wrapper}
        );

        // Assert — badge should not be present when count is 0
        expect(container.querySelector('.note-count')).toBeNull();
    });

    it('calls getNoteCount inside useEffect alongside hasPeriodicNote', async () => {
        // Arrange
        mockDayNoteViewModel.hasPeriodicNote.mockResolvedValue(false);
        mockDayNoteViewModel.getNoteCount.mockResolvedValue(0);

        // Act
        await act(async () => {
            render(
                <DailyNoteComponent
                    day={day}
                    today={null}
                    selectedPeriod={null}
                    isSameMonth={true}
                    noteCountToken={0}
                    onSelect={onSelect}
                />,
                {wrapper}
            );
        });

        // Assert
        expect(mockDayNoteViewModel.hasPeriodicNote).toHaveBeenCalledWith(day);
        expect(mockDayNoteViewModel.getNoteCount).toHaveBeenCalledWith(day);
    });

    it('re-runs the effect when the day changes', async () => {
        // Arrange
        mockDayNoteViewModel.hasPeriodicNote.mockResolvedValue(false);
        mockDayNoteViewModel.getNoteCount.mockResolvedValue(0);

        const updatedDay: Period = {...day, name: '3'};

        let rerender: (ui: React.ReactElement) => void;

        await act(async () => {
            const result = render(
                <DailyNoteComponent
                    day={day}
                    today={null}
                    selectedPeriod={null}
                    isSameMonth={true}
                    noteCountToken={0}
                    onSelect={onSelect}
                />,
                {wrapper}
            );
            rerender = result.rerender;
        });

        jest.clearAllMocks();
        mockDayNoteViewModel.hasPeriodicNote.mockResolvedValue(false);
        mockDayNoteViewModel.getNoteCount.mockResolvedValue(0);

        // Act
        await act(async () => {
            rerender!(
                <ViewModelsContext.Provider value={mockContext}>
                    <DailyNoteComponent
                        day={updatedDay}
                        today={null}
                        selectedPeriod={null}
                        isSameMonth={true}
                        noteCountToken={0}
                        onSelect={onSelect}
                    />
                </ViewModelsContext.Provider>
            );
        });

        // Assert
        expect(mockDayNoteViewModel.getNoteCount).toHaveBeenCalledWith(updatedDay);
    });

    it('renders a .note-count badge when getNoteCount returns a count greater than 0', async () => {
        // Arrange
        mockDayNoteViewModel.hasPeriodicNote.mockResolvedValue(false);
        mockDayNoteViewModel.getNoteCount.mockResolvedValue(3);

        // Act
        let container: HTMLElement;
        await act(async () => {
            const result = render(
                <DailyNoteComponent
                    day={day}
                    today={null}
                    selectedPeriod={null}
                    isSameMonth={true}
                    noteCountToken={0}
                    onSelect={onSelect}
                />,
                {wrapper}
            );
            container = result.container;
        });

        // Assert
        const badge = container!.querySelector('.note-count');
        expect(badge).not.toBeNull();
        expect(badge!.textContent).toBe('3');
    });

    it('re-runs the effect when noteCountToken changes', async () => {
        // Arrange
        mockDayNoteViewModel.hasPeriodicNote.mockResolvedValue(false);
        mockDayNoteViewModel.getNoteCount.mockResolvedValue(0);

        let rerender: (ui: React.ReactElement) => void;

        await act(async () => {
            const result = render(
                <DailyNoteComponent
                    day={day}
                    today={null}
                    selectedPeriod={null}
                    isSameMonth={true}
                    noteCountToken={0}
                    onSelect={onSelect}
                />,
                {wrapper}
            );
            rerender = result.rerender;
        });

        jest.clearAllMocks();
        mockDayNoteViewModel.hasPeriodicNote.mockResolvedValue(false);
        mockDayNoteViewModel.getNoteCount.mockResolvedValue(2);

        // Act
        await act(async () => {
            rerender!(
                <ViewModelsContext.Provider value={mockContext}>
                    <DailyNoteComponent
                        day={day}
                        today={null}
                        selectedPeriod={null}
                        isSameMonth={true}
                        noteCountToken={1}
                        onSelect={onSelect}
                    />
                </ViewModelsContext.Provider>
            );
        });

        // Assert
        expect(mockDayNoteViewModel.getNoteCount).toHaveBeenCalledWith(day);
    });
});
