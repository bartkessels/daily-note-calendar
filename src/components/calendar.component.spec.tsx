import React from 'react';
import {fireEvent, render, screen} from '@testing-library/react';
import '@testing-library/jest-dom';
import {CalendarComponent} from 'src/components/calendar.component';
import {DateManager} from 'src/domain/managers/date.manager';
import 'src/extensions/extensions';
import {DateManagerContext} from 'src/components/providers/datemanager.provider';
import {Day} from 'src/domain/models/day';
import {Event} from 'src/domain/events/event';
import {Week} from 'src/domain/models/week';
import {Month} from 'src/domain/models/month';
import {DailyNoteEventContext} from 'src/components/providers/daily-note-event.context';
import {WeeklyNoteEventContext} from 'src/components/providers/weekly-note-event.context';
import {MonthlyNoteEventContext} from 'src/components/providers/monthly-note-event.context';

const mockDateManager = {
    getCurrentMonth: jest.fn(),
    getNextMonth: jest.fn(),
    getPreviousMonth: jest.fn()
} as DateManager;

describe('CalendarComponent', () => {
    let month: Month;
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

    beforeEach(() => {
        month = {
            name: 'October',
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

        (mockDateManager.getCurrentMonth as jest.Mock).mockReturnValue(month);
    });

    it('renders the current month and year', () => {
        render(
            <DateManagerContext.Provider value={mockDateManager}>
                <MonthlyNoteEventContext.Provider value={mockMonthlyNoteEvent}>
                    <WeeklyNoteEventContext.Provider value={mockWeeklyNoteEvent}>
                        <DailyNoteEventContext.Provider value={mockDailyNoteEvent}>
                            <CalendarComponent />
                        </DailyNoteEventContext.Provider>
                    </WeeklyNoteEventContext.Provider>
                </MonthlyNoteEventContext.Provider>
            </DateManagerContext.Provider>
        );

        expect(screen.getByText('October')).toBeDefined();
        expect(screen.getByText('2023')).toBeDefined();
    });

    it('calls goToNextMonth when ChevronRight is clicked', () => {
        render(
            <DateManagerContext.Provider value={mockDateManager}>
                <MonthlyNoteEventContext.Provider value={mockMonthlyNoteEvent}>
                    <WeeklyNoteEventContext.Provider value={mockWeeklyNoteEvent}>
                        <DailyNoteEventContext.Provider value={mockDailyNoteEvent}>
                            <CalendarComponent />
                        </DailyNoteEventContext.Provider>
                    </WeeklyNoteEventContext.Provider>
                </MonthlyNoteEventContext.Provider>
            </DateManagerContext.Provider>
        );

        fireEvent.click(document.querySelector('.lucide-chevron-right')!);
        expect(mockDateManager.getNextMonth).toHaveBeenCalled();
    });

    it('calls goToPreviousMonth when ChevronLeft is clicked', () => {
        render(
            <DateManagerContext.Provider value={mockDateManager}>
                <MonthlyNoteEventContext.Provider value={mockMonthlyNoteEvent}>
                    <WeeklyNoteEventContext.Provider value={mockWeeklyNoteEvent}>
                        <DailyNoteEventContext.Provider value={mockDailyNoteEvent}>
                            <CalendarComponent />
                        </DailyNoteEventContext.Provider>
                    </WeeklyNoteEventContext.Provider>
                </MonthlyNoteEventContext.Provider>
            </DateManagerContext.Provider>
        );

        fireEvent.click(document.querySelector('.lucide-chevron-left')!);
        expect(mockDateManager.getPreviousMonth).toHaveBeenCalled();
    });

    it('calls goToCurrentMonth when CalendarHeart is clicked', () => {
        render(
            <DateManagerContext.Provider value={mockDateManager}>
                <MonthlyNoteEventContext.Provider value={mockMonthlyNoteEvent}>
                    <WeeklyNoteEventContext.Provider value={mockWeeklyNoteEvent}>
                        <DailyNoteEventContext.Provider value={mockDailyNoteEvent}>
                            <CalendarComponent />
                        </DailyNoteEventContext.Provider>
                    </WeeklyNoteEventContext.Provider>
                </MonthlyNoteEventContext.Provider>
            </DateManagerContext.Provider>
        );

        fireEvent.click(document.querySelector('.lucide-calendar-heart')!);
        expect(mockDateManager.getCurrentMonth).toHaveBeenCalled();
    });

    it('emits the daily note event when a day is clicked', () => {
        render(
            <DateManagerContext.Provider value={mockDateManager}>
                <MonthlyNoteEventContext.Provider value={mockMonthlyNoteEvent}>
                    <WeeklyNoteEventContext.Provider value={mockWeeklyNoteEvent}>
                        <DailyNoteEventContext.Provider value={mockDailyNoteEvent}>
                            <CalendarComponent />
                        </DailyNoteEventContext.Provider>
                    </WeeklyNoteEventContext.Provider>
                </MonthlyNoteEventContext.Provider>
            </DateManagerContext.Provider>
        );

        fireEvent.click(screen.getByText('2'));
        expect(mockDailyNoteEvent.emitEvent).toHaveBeenCalledWith(month.weeks[0].days[0]);
    });

    it('emits the weekly note event when a week is clicked', () => {
        render(
            <DateManagerContext.Provider value={mockDateManager}>
                <MonthlyNoteEventContext.Provider value={mockMonthlyNoteEvent}>
                    <WeeklyNoteEventContext.Provider value={mockWeeklyNoteEvent}>
                        <DailyNoteEventContext.Provider value={mockDailyNoteEvent}>
                            <CalendarComponent />
                        </DailyNoteEventContext.Provider>
                    </WeeklyNoteEventContext.Provider>
                </MonthlyNoteEventContext.Provider>
            </DateManagerContext.Provider>
        );

        fireEvent.click(screen.getByText('40'));
        expect(mockWeeklyNoteEvent.emitEvent).toHaveBeenCalledWith(month.weeks[0]);
    });

    it('emits the monthly note event when a month is clicked', () => {
        render(
            <DateManagerContext.Provider value={mockDateManager}>
                <MonthlyNoteEventContext.Provider value={mockMonthlyNoteEvent}>
                    <WeeklyNoteEventContext.Provider value={mockWeeklyNoteEvent}>
                        <DailyNoteEventContext.Provider value={mockDailyNoteEvent}>
                            <CalendarComponent />
                        </DailyNoteEventContext.Provider>
                    </WeeklyNoteEventContext.Provider>
                </MonthlyNoteEventContext.Provider>
            </DateManagerContext.Provider>
        );

        fireEvent.click(screen.getByText('October'));
        expect(mockMonthlyNoteEvent.emitEvent).toHaveBeenCalledWith(month);
    });
});