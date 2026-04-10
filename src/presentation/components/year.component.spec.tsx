import React, {ReactNode} from 'react';
import {render, act} from '@testing-library/react';
import {YearlyNoteComponent} from 'src/presentation/components/year.component';
import {ViewModelsContext} from 'src/presentation/context/view-model.context';
import {ViewModelsContext as ViewModelsContextType} from 'src/presentation/context/view-model.context';
import {mockCalendarViewModel, mockDayNoteViewModel, mockPeriodNoteViewModel} from 'src/test-helpers/view-model.mocks';
import {mockPeriod} from 'src/test-helpers/model.mocks';
import {Period, PeriodType} from 'src/domain/models/period.model';

describe('YearlyNoteComponent', () => {
    const year: Period = {
        ...mockPeriod,
        type: PeriodType.Year,
        name: '2023',
        date: new Date(2023, 0, 1),
    };

    const mockYearlyViewModel = {...mockPeriodNoteViewModel};

    const mockContext: ViewModelsContextType = {
        calendarViewModel: mockCalendarViewModel,
        dailyNoteViewModel: mockDayNoteViewModel,
        weeklyNoteViewModel: {...mockPeriodNoteViewModel},
        monthlyNoteViewModel: {...mockPeriodNoteViewModel},
        quarterlyNoteViewModel: {...mockPeriodNoteViewModel},
        yearlyNoteViewModel: mockYearlyViewModel,
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
        mockYearlyViewModel.hasPeriodicNote.mockResolvedValue(false);
    });

    it('renders without crashing', () => {
        const {container} = render(<YearlyNoteComponent year={year} />, {wrapper});
        expect(container.firstChild).toBeTruthy();
    });

    it('checks if periodic note exists on render', async () => {
        mockYearlyViewModel.hasPeriodicNote.mockResolvedValue(false);

        await act(async () => {
            render(<YearlyNoteComponent year={year} />, {wrapper});
        });

        expect(mockYearlyViewModel.hasPeriodicNote).toHaveBeenCalledWith(year);
    });

    it('renders PeriodComponent with correct name prop', async () => {
        mockYearlyViewModel.hasPeriodicNote.mockResolvedValue(false);

        const {container} = render(<YearlyNoteComponent year={year} />, {wrapper});

        expect(container.textContent).toContain(year.name);
    });

    it('checks if periodic note exists and renders properly when note does not exist', async () => {
        mockYearlyViewModel.hasPeriodicNote.mockResolvedValue(false);

        const {container} = render(<YearlyNoteComponent year={year} />, {wrapper});

        expect(mockYearlyViewModel.hasPeriodicNote).toHaveBeenCalledWith(year);
        expect(container.textContent).toContain(year.name);
    });

    it('checks if periodic note exists and renders properly when note exists', async () => {
        mockYearlyViewModel.hasPeriodicNote.mockResolvedValue(true);

        const {container} = render(<YearlyNoteComponent year={year} />, {wrapper});
        await act(async () => {
            // Allow state update
            await new Promise(resolve => setTimeout(resolve, 10));
        });

        expect(mockYearlyViewModel.hasPeriodicNote).toHaveBeenCalledWith(year);
        expect(container.textContent).toContain(year.name);
    });
});
