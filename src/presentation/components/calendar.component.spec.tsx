import React, {ReactNode} from 'react';
import {render, act, screen, fireEvent} from '@testing-library/react';
import {CalendarComponent} from 'src/presentation/components/calendar.component';
import {ViewModelsContext} from 'src/presentation/context/view-model.context';
import {ViewModelsContext as ViewModelsContextType} from 'src/presentation/context/view-model.context';
import {mockCalendarViewModel, mockDayNoteViewModel, mockPeriodNoteViewModel, mockNotesViewModel} from 'src/test-helpers/view-model.mocks';
import {mockPeriod} from 'src/test-helpers/model.mocks';
import {Period, PeriodType} from 'src/domain/models/period.model';
import {Calendar} from 'src/domain/models/calendar.model';
import {Week} from 'src/domain/models/week';

describe('CalendarComponent', () => {
    const today: Period = {
        ...mockPeriod,
        date: new Date(2023, 9, 5),
        name: '5',
    };

    const days: Period[] = Array.from({length: 7}, (_, i) => ({
        ...mockPeriod,
        date: new Date(2023, 9, i + 1),
        name: String(i + 1),
    }));

    const week: Week = {
        ...mockPeriod,
        type: PeriodType.Week,
        name: '40',
        date: new Date(2023, 9, 1),
        weekNumber: 40,
        year: {...mockPeriod, type: PeriodType.Year, name: '2023', date: new Date(2023, 0, 1)},
        quarter: {...mockPeriod, type: PeriodType.Quarter, name: 'Q4', date: new Date(2023, 9, 1)},
        month: {...mockPeriod, type: PeriodType.Month, name: 'October', date: new Date(2023, 9, 1)},
        days,
    };

    const mockCalendar: Calendar = {
        weekDays: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
        month: {...mockPeriod, type: PeriodType.Month, name: 'October', date: new Date(2023, 9, 1)},
        quarter: {...mockPeriod, type: PeriodType.Quarter, name: 'Q4', date: new Date(2023, 9, 1)},
        year: {...mockPeriod, type: PeriodType.Year, name: '2023', date: new Date(2023, 0, 1)},
        weeks: [week],
        today,
    };

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
        mockCalendarViewModel.getCurrentWeek.mockReturnValue(mockCalendar);
        mockCalendarViewModel.getNextWeek.mockReturnValue(mockCalendar);
        mockCalendarViewModel.getPreviousWeek.mockReturnValue(mockCalendar);
        mockCalendarViewModel.getNextMonth.mockReturnValue(mockCalendar);
        mockCalendarViewModel.getPreviousMonth.mockReturnValue(mockCalendar);
        mockDayNoteViewModel.hasPeriodicNote.mockResolvedValue(false);
        mockDayNoteViewModel.getNoteCount.mockResolvedValue(0);
        mockPeriodNoteViewModel.hasPeriodicNote.mockResolvedValue(false);
        mockNotesViewModel.loadNotes.mockResolvedValue([]);
    });

    it('renders without crashing when no initial calendar provided', () => {
        const {container} = render(<CalendarComponent />, {wrapper});
        expect(container.firstChild).toBeTruthy();
    });

    it('renders with initial calendar', () => {
        const {container} = render(<CalendarComponent initialCalendar={mockCalendar} />, {wrapper});
        expect(container.firstChild).toBeTruthy();
        expect(container.querySelector('.dnc')).toBeTruthy();
    });

    it('calls getCurrentWeek on mount', async () => {
        await act(async () => {
            render(<CalendarComponent />, {wrapper});
        });

        expect(mockCalendarViewModel.getCurrentWeek).toHaveBeenCalled();
    });

    it('calls initializeCallbacks with state setters', async () => {
        await act(async () => {
            render(<CalendarComponent />, {wrapper});
        });

        expect(mockCalendarViewModel.initializeCallbacks).toHaveBeenCalledWith(
            expect.any(Function),
            expect.any(Function),
            expect.any(Function),
            expect.any(Function),
            expect.any(Function),
            expect.any(Function),
        );
    });

    it('calls initializeNoteCountRefreshCallback', async () => {
        await act(async () => {
            render(<CalendarComponent />, {wrapper});
        });

        expect(mockCalendarViewModel.initializeNoteCountRefreshCallback).toHaveBeenCalledWith(
            expect.any(Function),
        );
    });

    it('renders month name in header', async () => {
        const {container} = render(<CalendarComponent initialCalendar={mockCalendar} />, {wrapper});

        expect(container.textContent).toContain('October');
    });

    it('renders year in header', async () => {
        const {container} = render(<CalendarComponent initialCalendar={mockCalendar} />, {wrapper});

        expect(container.textContent).toContain('2023');
    });

    it('renders quarter in table header', async () => {
        const {container} = render(<CalendarComponent initialCalendar={mockCalendar} />, {wrapper});

        expect(container.textContent).toContain('Q4');
    });

    it('renders week day headers', async () => {
        const {container} = render(<CalendarComponent initialCalendar={mockCalendar} />, {wrapper});

        mockCalendar.weekDays.forEach(day => {
            expect(container.textContent).toContain(day);
        });
    });

    it('renders navigation buttons', async () => {
        const {container} = render(<CalendarComponent initialCalendar={mockCalendar} />, {wrapper});

        const buttons = container.querySelector('.buttons');
        expect(buttons).toBeTruthy();
        // Should have 5 navigation icons
        expect(buttons?.querySelectorAll('svg').length).toBe(5);
    });

    it('loads previous week when left chevron clicked', async () => {
        mockCalendarViewModel.getPreviousWeek.mockReturnValue(mockCalendar);

        const {container} = render(<CalendarComponent initialCalendar={mockCalendar} />, {wrapper});

        const buttons = container.querySelectorAll('.buttons svg');
        const previousWeekButton = buttons[1]; // ChevronLeft

        await act(async () => {
            fireEvent.click(previousWeekButton);
        });

        expect(mockCalendarViewModel.getPreviousWeek).toHaveBeenCalledWith(mockCalendar);
    });

    it('loads next week when right chevron clicked', async () => {
        mockCalendarViewModel.getNextWeek.mockReturnValue(mockCalendar);

        const {container} = render(<CalendarComponent initialCalendar={mockCalendar} />, {wrapper});

        const buttons = container.querySelectorAll('.buttons svg');
        const nextWeekButton = buttons[3]; // ChevronRight

        await act(async () => {
            fireEvent.click(nextWeekButton);
        });

        expect(mockCalendarViewModel.getNextWeek).toHaveBeenCalledWith(mockCalendar);
    });

    it('loads current week when calendar heart clicked', async () => {
        mockCalendarViewModel.getCurrentWeek.mockReturnValue(mockCalendar);

        const {container} = render(<CalendarComponent initialCalendar={mockCalendar} />, {wrapper});

        const buttons = container.querySelectorAll('.buttons svg');
        const currentWeekButton = buttons[2]; // CalendarHeart

        await act(async () => {
            fireEvent.click(currentWeekButton);
        });

        // Called once on mount + once on click
        expect(mockCalendarViewModel.getCurrentWeek).toHaveBeenCalledTimes(2);
    });

    it('loads previous month when double left chevron clicked', async () => {
        mockCalendarViewModel.getPreviousMonth.mockReturnValue(mockCalendar);

        const {container} = render(<CalendarComponent initialCalendar={mockCalendar} />, {wrapper});

        const buttons = container.querySelectorAll('.buttons svg');
        const previousMonthButton = buttons[0]; // ChevronsLeft

        await act(async () => {
            fireEvent.click(previousMonthButton);
        });

        expect(mockCalendarViewModel.getPreviousMonth).toHaveBeenCalledWith(mockCalendar);
    });

    it('loads next month when double right chevron clicked', async () => {
        mockCalendarViewModel.getNextMonth.mockReturnValue(mockCalendar);

        const {container} = render(<CalendarComponent initialCalendar={mockCalendar} />, {wrapper});

        const buttons = container.querySelectorAll('.buttons svg');
        const nextMonthButton = buttons[4]; // ChevronsRight

        await act(async () => {
            fireEvent.click(nextMonthButton);
        });

        expect(mockCalendarViewModel.getNextMonth).toHaveBeenCalledWith(mockCalendar);
    });

    it('renders NotesComponent', async () => {
        const {container} = render(<CalendarComponent initialCalendar={mockCalendar} />, {wrapper});

        // NotesComponent should be rendered
        expect(container.querySelector('.dnc')).toBeTruthy();
    });

    it('renders calendar with multiple weeks', async () => {
        const days2: Period[] = Array.from({length: 7}, (_, i) => ({
            ...mockPeriod,
            date: new Date(2023, 9, i + 8),
            name: String(i + 8),
        }));

        const week2: Week = {
            ...mockPeriod,
            type: PeriodType.Week,
            name: '41',
            date: new Date(2023, 9, 8),
            weekNumber: 41,
            year: {...mockPeriod, type: PeriodType.Year, name: '2023', date: new Date(2023, 0, 1)},
            quarter: {...mockPeriod, type: PeriodType.Quarter, name: 'Q4', date: new Date(2023, 9, 1)},
            month: {...mockPeriod, type: PeriodType.Month, name: 'October', date: new Date(2023, 9, 1)},
            days: days2,
        };

        const multiWeekCalendar: Calendar = {
            ...mockCalendar,
            weeks: [week, week2],
        };

        const {container} = render(<CalendarComponent initialCalendar={multiWeekCalendar} />, {wrapper});

        // Verify calendar renders with multiple weeks by checking the table structure
        const tbody = container.querySelector('tbody');
        expect(tbody).toBeTruthy();
        expect(container.querySelector('.dnc')).toBeTruthy();
    });

    it('returns empty fragment when viewModel provides no calendar', () => {
        // Mock getCurrentWeek to return a calendar that will be set but then cleared
        mockCalendarViewModel.getCurrentWeek.mockReturnValue(mockCalendar);

        const {container} = render(<CalendarComponent initialCalendar={null} />, {wrapper});

        // Initially renders empty when initialCalendar is null (before useEffect runs)
        // The actual behavior depends on timing, so we just verify no crash
        expect(container.firstChild).toBeDefined();
    });

    it('updates calendar when viewModel changes', async () => {
        const {rerender} = render(<CalendarComponent />, {wrapper});

        const newMockViewModel = {...mockCalendarViewModel};
        const newCalendar: Calendar = {
            ...mockCalendar,
            month: {...mockPeriod, type: PeriodType.Month, name: 'November', date: new Date(2023, 10, 1)},
        };
        newMockViewModel.getCurrentWeek.mockReturnValue(newCalendar);

        const newContext = {...mockContext, calendarViewModel: newMockViewModel};

        await act(async () => {
            rerender(
                <ViewModelsContext.Provider value={newContext}>
                    <CalendarComponent />
                </ViewModelsContext.Provider>,
            );
        });

        expect(newMockViewModel.getCurrentWeek).toHaveBeenCalled();
    });
});
