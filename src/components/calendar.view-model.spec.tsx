import {useCalendarViewModel} from 'src/components/calendar.view-model';
import {Day, DayOfWeek} from 'src/domain/models/day';
import {SelectDayEventContext} from 'src/components/providers/select-day-event.context';
import {DailyNoteEventContext} from 'src/components/providers/daily-note-event.context';
import {CalendarUiModel} from 'src/components/models/calendar.ui-model';
import {DateManagerContext} from 'src/components/providers/date-manager.context';
import {CalendarEnhancerContext} from 'src/components/providers/calendar-enhancer.context';
import {DateManager} from 'src/domain/managers/date.manager';
import {Enhancer} from 'src/domain/enhancers/enhancer';
import {Event} from 'src/domain/events/event';
import React from 'react';
import {SelectDayEvent} from 'src/implementation/events/select-day.event';
import {PeriodicNoteEvent} from 'src/implementation/events/periodic-note.event';
import {act, renderHook, waitFor} from '@testing-library/react';
import {Week} from 'src/domain/models/week';
import {Month} from 'src/domain/models/month';
import {Year} from 'src/domain/models/year';


describe('useCalendarViewModel', () => {
    let currentDay: Day;
    let currentWeek: Week;
    let currentMonth: Month;
    let currentYear: Year;

    const mockDateManager = {
        getCurrentMonth: jest.fn().mockReturnValue(currentMonth),
        getCurrentYear: jest.fn().mockReturnValue({ name: '2023' }),
        getCurrentDay: jest.fn().mockReturnValue({ date: new Date(), name: 'Today' }),
        getPreviousMonth: jest.fn().mockReturnValue({ name: 'September' }),
        getNextMonth: jest.fn().mockReturnValue({ name: 'November' }),
        getYear: jest.fn().mockReturnValue({ name: '2023' })
    } as DateManager;

    const mockCalendarEnhancer = {
        withValue: jest.fn().mockReturnThis(),
        build: jest.fn().mockResolvedValue({ currentMonth: { name: 'October' } })
    } as unknown as Enhancer<CalendarUiModel>;

    let selectDayEvent: Event<Day>;
    let dailyNoteEvent: Event<Day>;

    beforeEach(() => {
        selectDayEvent = new SelectDayEvent();
        dailyNoteEvent = new PeriodicNoteEvent<Day>();
    });

    const setup = () => {
        return renderHook(() => useCalendarViewModel(), {
            wrapper: ({ children }: { children: React.ReactNode }) => (
                <DateManagerContext.Provider value={mockDateManager}>
                    <CalendarEnhancerContext.Provider value={mockCalendarEnhancer}>
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
            expect(result.current.viewState?.currentMonth?.month?.name).toBe('October');
            expect(result.current.viewState?.currentYear?.name).toBe('2023');
        });
    });

    it('navigates to the previous month', async () => {
        const { result } = setup();

        act(() => {
            result.current.navigateToPreviousMonth();
        });

        await waitFor(() => {
            expect(result.current.viewState?.currentMonth?.month?.name).toBe('September');
        });
    });

    it('navigates to the next month', async () => {
        const { result } = setup();

        act(() => {
            result.current.navigateToNextMonth();
        });

        await waitFor(() => {
            expect(result.current.viewState?.currentMonth?.month?.name).toBe('November');
        });
    });

    it('navigates to the current month', async () => {
        const { result } = setup();

        act(() => {
            result.current.navigateToCurrentMonth();
        });

        await waitFor(() => {
            expect(result.current.viewState?.currentMonth?.month?.name).toBe('October');
        });
    });

    it('updates the selected day when selectDayEvent is triggered', async () => {
        const { result } = setup();
        const newDay: Day = { date: new Date(2023, 9, 2), dayOfWeek: DayOfWeek.Monday, name: '2' };

        act(() => {
            selectDayEvent.emitEvent(newDay);
        });

        expect(result.current.viewState?.selectedDay?.name).toBe('2');
    });

    it('updates the selected day when dailyNoteEvent is triggered', async () => {
        const { result } = setup();
        const newDay: Day = { date: new Date(2023, 9, 2), dayOfWeek: DayOfWeek.Monday, name: '2' };

        act(() => {
            dailyNoteEvent.emitEvent(newDay);
        });

        expect(result.current.viewState?.selectedDay?.name).toBe('2');
    });
});