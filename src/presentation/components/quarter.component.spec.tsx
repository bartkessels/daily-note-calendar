import React, {ReactNode} from 'react';
import {render, act} from '@testing-library/react';
import {QuarterlyNoteComponent} from 'src/presentation/components/quarter.component';
import {ViewModelsContext} from 'src/presentation/context/view-model.context';
import {ViewModelsContext as ViewModelsContextType} from 'src/presentation/context/view-model.context';
import {mockCalendarViewModel, mockDayNoteViewModel, mockPeriodNoteViewModel} from 'src/test-helpers/view-model.mocks';
import {mockPeriod} from 'src/test-helpers/model.mocks';
import {Period, PeriodType} from 'src/domain/models/period.model';

describe('QuarterlyNoteComponent', () => {
    const quarter: Period = {
        ...mockPeriod,
        type: PeriodType.Quarter,
        name: 'Q3',
        date: new Date(2023, 6, 1),
    };

    const mockQuarterlyViewModel = {...mockPeriodNoteViewModel};

    const mockContext: ViewModelsContextType = {
        calendarViewModel: mockCalendarViewModel,
        dailyNoteViewModel: mockDayNoteViewModel,
        weeklyNoteViewModel: {...mockPeriodNoteViewModel},
        monthlyNoteViewModel: {...mockPeriodNoteViewModel},
        quarterlyNoteViewModel: mockQuarterlyViewModel,
        yearlyNoteViewModel: {...mockPeriodNoteViewModel},
        notesViewModel: {
            updateNotes: jest.fn(),
            initializeCallbacks: jest.fn(),
            loadNotes: jest.fn(),
            openNote: jest.fn(),
            openNoteInHorizontalSplitView: jest.fn(),
            openNoteInVerticalSplitView: jest.fn(),
            deleteNote: jest.fn(),
        },
    };

    const wrapper = ({children}: {children: ReactNode}) => (
        <ViewModelsContext.Provider value={mockContext}>
            {children}
        </ViewModelsContext.Provider>
    );

    beforeEach(() => {
        jest.clearAllMocks();
        mockQuarterlyViewModel.hasPeriodicNote.mockResolvedValue(false);
    });

    it('renders without crashing', () => {
        const {container} = render(<QuarterlyNoteComponent quarter={quarter} />, {wrapper});
        expect(container.firstChild).toBeTruthy();
    });

    it('checks if periodic note exists on render', async () => {
        mockQuarterlyViewModel.hasPeriodicNote.mockResolvedValue(false);

        await act(async () => {
            render(<QuarterlyNoteComponent quarter={quarter} />, {wrapper});
        });

        expect(mockQuarterlyViewModel.hasPeriodicNote).toHaveBeenCalledWith(quarter);
    });

    it('renders PeriodComponent with correct name prop', async () => {
        mockQuarterlyViewModel.hasPeriodicNote.mockResolvedValue(false);

        const {container} = await act(async () => {
            return render(<QuarterlyNoteComponent quarter={quarter} />, {wrapper});
        });

        expect(container.textContent).toContain(quarter.name);
    });

    it('checks if periodic note exists and renders properly when note does not exist', async () => {
        mockQuarterlyViewModel.hasPeriodicNote.mockResolvedValue(false);

        const {container} = await act(async () => {
            return render(<QuarterlyNoteComponent quarter={quarter} />, {wrapper});
        });

        expect(mockQuarterlyViewModel.hasPeriodicNote).toHaveBeenCalledWith(quarter);
        expect(container.textContent).toContain(quarter.name);
    });

    it('checks if periodic note exists and renders properly when note exists', async () => {
        mockQuarterlyViewModel.hasPeriodicNote.mockResolvedValue(true);

        const {container} = await act(async () => {
            const result = render(<QuarterlyNoteComponent quarter={quarter} />, {wrapper});
            // Allow state update
            await new Promise(resolve => setTimeout(resolve, 10));
            return result;
        });

        expect(mockQuarterlyViewModel.hasPeriodicNote).toHaveBeenCalledWith(quarter);
        expect(container.textContent).toContain(quarter.name);
    });
});
