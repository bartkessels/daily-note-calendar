import React, {ReactNode} from 'react';
import {render, act} from '@testing-library/react';
import {MonthlyNoteComponent} from 'src/presentation/components/month.component';
import {ViewModelsContext} from 'src/presentation/context/view-model.context';
import {ViewModelsContext as ViewModelsContextType} from 'src/presentation/context/view-model.context';
import {mockCalendarViewModel, mockDayNoteViewModel, mockPeriodNoteViewModel} from 'src/test-helpers/view-model.mocks';
import {mockPeriod} from 'src/test-helpers/model.mocks';
import {Period, PeriodType} from 'src/domain/models/period.model';

describe('MonthlyNoteComponent', () => {
    const month: Period = {
        ...mockPeriod,
        type: PeriodType.Month,
        name: 'October',
        date: new Date(2023, 9, 1),
    };

    const mockMonthlyViewModel = {...mockPeriodNoteViewModel};

    const mockContext: ViewModelsContextType = {
        calendarViewModel: mockCalendarViewModel,
        dailyNoteViewModel: mockDayNoteViewModel,
        weeklyNoteViewModel: {...mockPeriodNoteViewModel},
        monthlyNoteViewModel: mockMonthlyViewModel,
        quarterlyNoteViewModel: {...mockPeriodNoteViewModel},
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
        mockMonthlyViewModel.hasPeriodicNote.mockResolvedValue(false);
    });

    it('renders without crashing', () => {
        const {container} = render(<MonthlyNoteComponent month={month} />, {wrapper});
        expect(container.firstChild).toBeTruthy();
    });

    it('checks if periodic note exists on render', async () => {
        mockMonthlyViewModel.hasPeriodicNote.mockResolvedValue(false);

        await act(async () => {
            render(<MonthlyNoteComponent month={month} />, {wrapper});
        });

        expect(mockMonthlyViewModel.hasPeriodicNote).toHaveBeenCalledWith(month);
    });

    it('renders PeriodComponent with correct name prop', async () => {
        mockMonthlyViewModel.hasPeriodicNote.mockResolvedValue(false);

        const {container} = await act(async () => {
            return render(<MonthlyNoteComponent month={month} />, {wrapper});
        });

        expect(container.textContent).toContain(month.name);
    });

    it('checks if periodic note exists and renders properly when note does not exist', async () => {
        mockMonthlyViewModel.hasPeriodicNote.mockResolvedValue(false);

        const {container} = await act(async () => {
            return render(<MonthlyNoteComponent month={month} />, {wrapper});
        });

        expect(mockMonthlyViewModel.hasPeriodicNote).toHaveBeenCalledWith(month);
        expect(container.textContent).toContain(month.name);
    });

    it('checks if periodic note exists and renders properly when note exists', async () => {
        mockMonthlyViewModel.hasPeriodicNote.mockResolvedValue(true);

        const {container} = await act(async () => {
            const result = render(<MonthlyNoteComponent month={month} />, {wrapper});
            // Allow state update
            await new Promise(resolve => setTimeout(resolve, 10));
            return result;
        });

        expect(mockMonthlyViewModel.hasPeriodicNote).toHaveBeenCalledWith(month);
        expect(container.textContent).toContain(month.name);
    });
});
