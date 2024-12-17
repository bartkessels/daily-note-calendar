import React, { ReactElement } from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { CalendarComponent } from 'src/components/calendar.component';
import { DateManager } from 'src/domain/managers/date.manager';
import { DateManagerContext } from 'src/components/providers/date-manager.context';
import { Day } from 'src/domain/models/day';
import { Event } from 'src/domain/events/event';
import { Week } from 'src/domain/models/week';
import { Month } from 'src/domain/models/month';
import { DailyNoteEventContext } from 'src/components/providers/daily-note-event.context';
import { WeeklyNoteEventContext } from 'src/components/providers/weekly-note-event.context';
import { MonthlyNoteEventContext } from 'src/components/providers/monthly-note-event.context';
import { YearlyNoteEventContext } from 'src/components/providers/yearly-note-event.context';
import { Year } from 'src/domain/models/year';
import { QuarterlyNoteEventContext } from 'src/components/providers/quarterly-note-event.context';
import { SelectDayEventContext } from 'src/components/providers/select-day-event.context';
import { SelectDayEvent } from 'src/implementation/events/select-day.event';

describe('CalendarComponent', () => {
    let month: Month;
    let year: Year;
    const mockDateManager = {
        getCurrentYear: jest.fn(),
        getYear: jest.fn(),
        getCurrentMonth: jest.fn(),
        getNextMonth: jest.fn(),
        getPreviousMonth: jest.fn()
    } as unknown as DateManager;
    let selectDayEvent: Event<Day>;
    const mockDailyNoteEvent = {
        onEvent: jest.fn(),
        emitEvent: jest.fn(),
    } as unknown as Event<Day>;
    const mockWeeklyNoteEvent = {
        onEvent: jest.fn(),
        emitEvent: jest.fn()
    } as unknown as Event<Week>;
    const mockMonthlyNoteEvent = {
        onEvent: jest.fn(),
        emitEvent: jest.fn()
    } as unknown as Event<Month>;
    const mockQuarterlyNoteEvent = {
        onEvent: jest.fn(),
        emitEvent: jest.fn()
    } as unknown as Event<Month>;
    const mockYearlyNoteEvent = {
        onEvent: jest.fn(),
        emitEvent: jest.fn()
    } as unknown as Event<Year>;

    beforeEach(() => {
        selectDayEvent = new SelectDayEvent();
        month = {
            date: new Date(2023, 9),
            name: 'October',
            quarter: 4,
            weeks: [
                {
                    date: new Date(2023, 9, 1),
                    weekNumber: 40,
                    days: [
                        { dayOfWeek: 1, date: new Date(2023, 9, 2), name: '2' },
                        { dayOfWeek: 2, date: new Date(2023, 9, 3), name: '3' },
                        { dayOfWeek: 3, date: new Date(2023, 9, 4), name: '4' },
                        { dayOfWeek: 4, date: new Date(2023, 9, 5), name: '5' },
                        { dayOfWeek: 5, date: new Date(2023, 9, 6), name: '6' },
                        { dayOfWeek: 6, date: new Date(2023, 9, 7), name: '7' },
                    ]
                }
            ]
        };

        year = {
            date: new Date(2023, 0),
            name: '2023',
            months: [month]
        };

        (mockDateManager.getCurrentYear as jest.Mock).mockReturnValue(year);
        (mockDateManager.getCurrentMonth as jest.Mock).mockReturnValue(month);
    });

    it('renders the current month and year', () => {
        render(setupContent(
            mockDateManager,
            selectDayEvent,
            mockYearlyNoteEvent,
            mockQuarterlyNoteEvent,
            mockMonthlyNoteEvent,
            mockWeeklyNoteEvent,
            mockDailyNoteEvent
        ));

        expect(screen.getByText('October')).toBeInTheDocument();
        expect(screen.getByText('2023')).toBeInTheDocument();
    });

    it('emits the quarterly note event when a quarter is clicked', () => {
        render(setupContent(
            mockDateManager,
            selectDayEvent,
            mockYearlyNoteEvent,
            mockQuarterlyNoteEvent,
            mockMonthlyNoteEvent,
            mockWeeklyNoteEvent,
            mockDailyNoteEvent
        ));

        fireEvent.click(screen.getByText('Q4'));
        expect(mockQuarterlyNoteEvent.emitEvent).toHaveBeenCalledWith(month);
    });

    it('navigates to the previous month when the left chevron is clicked', () => {
        const navigateToPreviousMonth = jest.fn();
        render(
            <DateManagerContext.Provider value={mockDateManager}>
                <CalendarComponent />
            </DateManagerContext.Provider>
        );

        fireEvent.click(screen.getByRole('img', { name: 'chevron-left' }));
        expect(navigateToPreviousMonth).toHaveBeenCalled();
    });

    it('navigates to the next month when the right chevron is clicked', () => {
        const navigateToNextMonth = jest.fn();
        render(
            <DateManagerContext.Provider value={mockDateManager}>
                <CalendarComponent />
            </DateManagerContext.Provider>
        );

        fireEvent.click(screen.getByRole('img', { name: 'chevron-right' }));
        expect(navigateToNextMonth).toHaveBeenCalled();
    });

    it('navigates to the current month when the calendar heart is clicked', () => {
        const navigateToCurrentMonth = jest.fn();
        render(
            <DateManagerContext.Provider value={mockDateManager}>
                <CalendarComponent />
            </DateManagerContext.Provider>
        );

        fireEvent.click(screen.getByRole('img', { name: 'calendar-heart' }));
        expect(navigateToCurrentMonth).toHaveBeenCalled();
    });
});

function setupContent(
    mockDateManager: DateManager,
    mockSelectDayEvent: Event<Day>,
    mockYearlyNoteEvent: Event<Year>,
    mockQuarterlyNoteEvent: Event<Month>,
    mockMonthlyNoteEvent: Event<Month>,
    mockWeeklyNoteEvent: Event<Week>,
    mockDailyNoteEvent: Event<Day>
): ReactElement {
    return (
        <DateManagerContext.Provider value={mockDateManager}>
            <SelectDayEventContext.Provider value={mockSelectDayEvent}>
                <YearlyNoteEventContext.Provider value={mockYearlyNoteEvent}>
                    <QuarterlyNoteEventContext.Provider value={mockQuarterlyNoteEvent}>
                        <MonthlyNoteEventContext.Provider value={mockMonthlyNoteEvent}>
                            <WeeklyNoteEventContext.Provider value={mockWeeklyNoteEvent}>
                                <DailyNoteEventContext.Provider value={mockDailyNoteEvent}>
                                    <CalendarComponent />
                                </DailyNoteEventContext.Provider>
                            </WeeklyNoteEventContext.Provider>
                        </MonthlyNoteEventContext.Provider>
                    </QuarterlyNoteEventContext.Provider>
                </YearlyNoteEventContext.Provider>
            </SelectDayEventContext.Provider>
        </DateManagerContext.Provider>
    );
}