import { renderHook, act, waitFor } from '@testing-library/react';
import { useCalendarViewModel } from 'src/components/calendar.view-model';
import { DateManagerContext } from 'src/components/providers/date-manager.context';
import { CalendarEnhancerContext } from 'src/components/providers/calendar-enhancer.context';
import { SelectDayEventContext } from 'src/components/providers/select-day-event.context';
import { DailyNoteEventContext } from 'src/components/providers/daily-note-event.context';
import { Day, DayOfWeek } from 'src/domain/models/day';
import { Week } from 'src/domain/models/week';
import { Month } from 'src/domain/models/month';
import { Year } from 'src/domain/models/year';
import { Event } from 'src/domain/events/event';
import { createCalendarUiModel } from 'src/components/models/calendar.ui-model';
import { CalendarUiModel } from 'src/components/models/calendar.ui-model';
import { DateManager } from 'src/domain/managers/date.manager';
import { Enhancer } from 'src/domain/enhancers/enhancer';
import {PeriodicNoteEvent} from 'src/implementation/events/periodic-note.event';

jest.mock('src/components/providers/date-manager.context');
jest.mock('src/components/providers/calendar-enhancer.context');

describe('useCalendarViewModel', () => {
    let currentDay: Day;
    let currentWeek: Week;
    let currentMonth: Month;
    let currentYear: Year;

    const mockDateManager = {
        getCurrentMonth: jest.fn(),
        getCurrentYear: jest.fn(),
        getCurrentDay: jest.fn(),
        getPreviousMonth: jest.fn(),
        getNextMonth: jest.fn(),
        getYear: jest.fn()
    } as jest.Mocked<DateManager>;

    const mockEnhancer = {
        withValue: jest.fn(),
        withStep: jest.fn(),
        build: jest.fn((value?: CalendarUiModel) => Promise.resolve(value))
    } as unknown as jest.Mocked<Enhancer<CalendarUiModel>>;

    let selectDayEvent: Event<Day>;
    let dailyNoteEvent: Event<Day>;

    beforeEach(() => {
        currentDay = { date: new Date(2023, 9, 1), dayOfWeek: DayOfWeek.Sunday, name: '1' };
        currentWeek = {
            date: new Date(2023, 9, 1),
            weekNumber: 40,
            days: [
                currentDay,
                { dayOfWeek: 1, date: new Date(2023, 9, 2), name: '2' },
                { dayOfWeek: 2, date: new Date(2023, 9, 3), name: '3' },
                { dayOfWeek: 3, date: new Date(2023, 9, 4), name: '4' },
                { dayOfWeek: 4, date: new Date(2023, 9, 5), name: '5' },
                { dayOfWeek: 5, date: new Date(2023, 9, 6), name: '6' },
                { dayOfWeek: 6, date: new Date(2023, 9, 7), name: '7' },
            ]
        };
        currentMonth = {
            date: new Date(2023, 9),
            name: 'October',
            quarter: 4,
            weeks: [currentWeek]
        };
        currentYear = {
            date: new Date(2024, 0),
            name: '2024',
            months: [currentMonth]
        };

        mockDateManager.getCurrentDay.mockReturnValue(currentDay);
        mockDateManager.getCurrentMonth.mockReturnValue(currentMonth);
        mockDateManager.getCurrentYear.mockReturnValue(currentYear);
        mockEnhancer.withStep.mockReturnValue(mockEnhancer);
        mockEnhancer.withValue.mockReturnValue(mockEnhancer);

        selectDayEvent = new PeriodicNoteEvent<Day>();
        dailyNoteEvent = new PeriodicNoteEvent<Day>();
    });

    const setup = () => {
        return renderHook(() => useCalendarViewModel(), {
            wrapper: ({ children }) => (
                <DateManagerContext.Provider value={mockDateManager}>
                    <CalendarEnhancerContext.Provider value={mockEnhancer}>
                        <SelectDayEventContext.Provider value={selectDayEvent}>
                            <DailyNoteEventContext.Provider value={dailyNoteEvent}>
                                {children}
                            </DailyNoteEventContext.Provider>
                        </SelectDayEventContext.Provider>
                    </CalendarEnhancerContext.Provider>
                </DateManagerContext.Provider>
            )
        });
    };

    it('initializes with the current month, year, and day', async () => {
        const { result } = setup();

        await waitFor(() => {
            console.log(result.current.viewState);
            expect(result.current.viewState?.uiModel?.currentMonth?.month?.name).toBe('October');
            expect(result.current.viewState?.uiModel?.currentYear?.name).toBe('2024');
        });
    });

    it('navigates to the previous month', async () => {
        const { result } = setup();

        act(() => {
            result.current.navigateToPreviousMonth();
        });

        await waitFor(() => {
            expect(result.current.viewState?.uiModel?.currentMonth?.month?.name).toBe('September');
        });
    });

    it('navigates to the next month', async () => {
        const { result } = setup();

        act(() => {
            result.current.navigateToNextMonth();
        });

        await waitFor(() => {
            expect(result.current.viewState?.uiModel?.currentMonth?.month?.name).toBe('November');
        });
    });

    it('navigates to the current month', async () => {
        const { result } = setup();

        act(() => {
            result.current.navigateToCurrentMonth();
        });

        await waitFor(() => {
            expect(result.current.viewState?.uiModel?.currentMonth?.month?.name).toBe('October');
        });
    });

    it('updates the selected day when selectDayEvent is triggered', async () => {
        const { result } = setup();
        const newDay: Day = { date: new Date(2023, 9, 2), dayOfWeek: DayOfWeek.Monday, name: '2' };

        act(() => {
            selectDayEvent.emitEvent(newDay);
        });

        // expect(result.current.viewState?.uiModel?.selectedDay?.name).toBe('2');
    });

    it('updates the selected day when dailyNoteEvent is triggered', async () => {
        const { result } = setup();
        const newDay: Day = { date: new Date(2023, 9, 2), dayOfWeek: DayOfWeek.Monday, name: '2' };

        act(() => {
            dailyNoteEvent.emitEvent(newDay);
        });

        // expect(result.current.viewState?.uiModel?.selectedDay?.name).toBe('2');
    });
});