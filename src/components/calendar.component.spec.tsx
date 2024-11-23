import React, {ReactElement} from 'react';
import {fireEvent, render, screen, waitFor} from '@testing-library/react';
import '@testing-library/jest-dom';
import {CalendarComponent} from 'src/components/calendar.component';
import {DateManager} from 'src/domain/managers/date.manager';
import 'src/extensions/extensions';
import {DateManagerContext} from 'src/components/providers/date-manager.context';
import {Day} from 'src/domain/models/day';
import {Event} from 'src/domain/events/event';
import {Week} from 'src/domain/models/week';
import {Month} from 'src/domain/models/month';
import {DailyNoteEventContext} from 'src/components/providers/daily-note-event.context';
import {WeeklyNoteEventContext} from 'src/components/providers/weekly-note-event.context';
import {MonthlyNoteEventContext} from 'src/components/providers/monthly-note-event.context';
import {YearlyNoteEventContext} from 'src/components/providers/yearly-note-event.context';
import {Year} from 'src/domain/models/year';
import {QuarterlyNoteEventContext} from 'src/components/providers/quarterly-note-event.context';
import {SelectDayEventContext} from 'src/components/providers/select-day-event.context';
import {SelectDayEvent} from 'src/implementation/events/select-day.event';
import {PeriodicNoteEvent} from 'src/implementation/events/periodic-note.event';

describe('CalendarComponent', () => {
    let month: Month;
    let year: Year;
    const mockDateManager = {
        getCurrentYear: jest.fn(),
        getYear: jest.fn(),
        getCurrentMonth: jest.fn(),
        getNextMonth: jest.fn(),
        getPreviousMonth: jest.fn()
    } as DateManager;
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
            name: 'October',
            quarter: 4,
            monthIndex: 9,
            number: 10,
            year: 2023,
            weeks: [
                {
                    weekNumber: 40,
                    days: [
                        { dayOfWeek: 1, date: 2, completeDate: new Date(2023, 9, 2), name: '2' },
                        { dayOfWeek: 2, date: 3, completeDate: new Date(2023, 9, 3), name: '3' },
                        { dayOfWeek: 3, date: 4, completeDate: new Date(2023, 9, 4), name: '4' },
                        { dayOfWeek: 4, date: 5, completeDate: new Date(2023, 9, 5), name: '5' },
                        { dayOfWeek: 5, date: 6, completeDate: new Date(2023, 9, 6), name: '6' },
                        { dayOfWeek: 6, date: 7, completeDate: new Date(2023, 9, 7), name: '7' },
                    ]
                }
            ]
        };

        year = {
            year: 2023,
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

        expect(screen.getByText('October')).toBeDefined();
        expect(screen.getByText('2023')).toBeDefined();
    });

    it('calls goToNextMonth when ChevronRight is clicked', () => {
        render(setupContent(
            mockDateManager,
            selectDayEvent,
            mockYearlyNoteEvent,
            mockQuarterlyNoteEvent,
            mockMonthlyNoteEvent,
            mockWeeklyNoteEvent,
            mockDailyNoteEvent
        ));

        fireEvent.click(document.querySelector('.lucide-chevron-right')!);
        expect(mockDateManager.getNextMonth).toHaveBeenCalled();
    });

    it('calls goToPreviousMonth when ChevronLeft is clicked', () => {
        render(setupContent(
            mockDateManager,
            selectDayEvent,
            mockYearlyNoteEvent,
            mockQuarterlyNoteEvent,
            mockMonthlyNoteEvent,
            mockWeeklyNoteEvent,
            mockDailyNoteEvent
        ));

        fireEvent.click(document.querySelector('.lucide-chevron-left')!);
        expect(mockDateManager.getPreviousMonth).toHaveBeenCalled();
    });

    it('calls goToCurrentMonth when CalendarHeart is clicked', () => {
        render(setupContent(
            mockDateManager,
            selectDayEvent,
            mockYearlyNoteEvent,
            mockQuarterlyNoteEvent,
            mockMonthlyNoteEvent,
            mockWeeklyNoteEvent,
            mockDailyNoteEvent
        ));

        fireEvent.click(document.querySelector('.lucide-calendar-heart')!);
        expect(mockDateManager.getCurrentMonth).toHaveBeenCalled();
    });

    it('emits the daily note event when a day is clicked', () => {
        render(setupContent(
            mockDateManager,
            selectDayEvent,
            mockYearlyNoteEvent,
            mockQuarterlyNoteEvent,
            mockMonthlyNoteEvent,
            mockWeeklyNoteEvent,
            mockDailyNoteEvent
        ));

        fireEvent.click(screen.getByText('2'));
        expect(mockDailyNoteEvent.emitEvent).toHaveBeenCalledWith(month.weeks[0].days[0]);
    });

    it('emits the weekly note event when a week is clicked', () => {
        render(setupContent(
            mockDateManager,
            selectDayEvent,
            mockYearlyNoteEvent,
            mockQuarterlyNoteEvent,
            mockMonthlyNoteEvent,
            mockWeeklyNoteEvent,
            mockDailyNoteEvent
        ));

        fireEvent.click(screen.getByText('40'));
        expect(mockWeeklyNoteEvent.emitEvent).toHaveBeenCalledWith(month.weeks[0]);
    });

    it('emits the monthly note event when a month is clicked', () => {
        render(setupContent(
            mockDateManager,
            selectDayEvent,
            mockYearlyNoteEvent,
            mockQuarterlyNoteEvent,
            mockMonthlyNoteEvent,
            mockWeeklyNoteEvent,
            mockDailyNoteEvent
        ));

        fireEvent.click(screen.getByText('October'));
        expect(mockMonthlyNoteEvent.emitEvent).toHaveBeenCalledWith(month);
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

    it('emits the yearly note event when a year is clicked', () => {
        render(setupContent(
            mockDateManager,
            selectDayEvent,
            mockYearlyNoteEvent,
            mockQuarterlyNoteEvent,
            mockMonthlyNoteEvent,
            mockWeeklyNoteEvent,
            mockDailyNoteEvent
        ));

        fireEvent.click(screen.getByText('2023'));
        expect(mockYearlyNoteEvent.emitEvent).toHaveBeenCalledWith(year);
    });

    it('should set selectDay class on the day that is emitted on the daily note event', async () => {
        const day: Day = { dayOfWeek: 1, date: 2, completeDate: new Date(2023, 9, 2), name: '2' };
        const dailyNoteEvent = new PeriodicNoteEvent<Day>();

        render(setupContent(
            mockDateManager,
            selectDayEvent,
            mockYearlyNoteEvent,
            mockQuarterlyNoteEvent,
            mockMonthlyNoteEvent,
            mockWeeklyNoteEvent,
            dailyNoteEvent
        ));

        React.act(() => dailyNoteEvent.emitEvent(day));

        await waitFor(() => expect(screen.getByText('2').classList).toContain('selected-day'));
    });

    it('should set selectDay class on the day that is emitted on the select day event', async () => {
        const day: Day = { dayOfWeek: 1, date: 2, completeDate: new Date(2023, 9, 2), name: '2' };

        render(setupContent(
            mockDateManager,
            selectDayEvent,
            mockYearlyNoteEvent,
            mockQuarterlyNoteEvent,
            mockMonthlyNoteEvent,
            mockWeeklyNoteEvent,
            mockDailyNoteEvent
        ));

        React.act(() => selectDayEvent.emitEvent(day));

        await waitFor(() => expect(screen.getByText('2').classList).toContain('selected-day'));
    });

    it('should set today id on today when the component is being rendered', () => {
        jest.spyOn(Date.prototype, 'isToday').mockImplementation(function() {
            return this.getDate() === 2 && this.getMonth() === 9 && this.getFullYear() === 2023;
        });

        render(setupContent(
            mockDateManager,
            selectDayEvent,
            mockYearlyNoteEvent,
            mockQuarterlyNoteEvent,
            mockMonthlyNoteEvent,
            mockWeeklyNoteEvent,
            mockDailyNoteEvent
        ));

        expect(screen.getByText('2').id).toContain('today');
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
    )
}