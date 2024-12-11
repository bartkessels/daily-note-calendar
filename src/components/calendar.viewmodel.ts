import {getSelectDayEvent} from 'src/components/providers/select-day-event.context';
import { getDailyNoteEvent } from './providers/daily-note-event.context';
import {getWeeklyNoteEvent} from 'src/components/providers/weekly-note-event.context';
import { getMonthlyNoteEvent } from './providers/monthly-note-event.context';
import { getQuarterlyNoteEvent } from './providers/quarterly-note-event.context';
import { getYearlyNoteEvent } from './providers/yearly-note-event.context';
import {Month} from 'src/domain/models/month';
import {useDateManager} from 'src/components/providers/date-manager.context';
import {Day} from 'src/domain/models/day';
import React from 'react';
import {Year} from 'src/domain/models/year';
import {Week} from 'src/domain/models/week';

export interface CalendarViewModel {
    viewState: CalendarViewState;
    openYearlyNote: (year?: Year) => void;
    openQuarterlyNote: (quarter?: Month) => void;
    openMonthlyNote: (month?: Month) => void;
    openWeeklyNote: (week?: Week) => void;
    openDailyNote: (day?: Day) => void;
    navigateToNextMonth: () => void;
    navigateToCurrentMonth: () => void;
    navigateToPreviousMonth: () => void;
}

export const useCalendarViewModel = (): CalendarViewModel => {
    const dateManager = useDateManager();
    const [viewState, setViewState] = React.useState<CalendarViewState>();

    const selectDayEvent = getSelectDayEvent();
    const dailyNoteEvent = getDailyNoteEvent();
    const weeklyNoteEvent = getWeeklyNoteEvent();
    const monthlyNoteEvent = getMonthlyNoteEvent();
    const quarterlyNoteEvent = getQuarterlyNoteEvent();
    const yearlyNoteEvent = getYearlyNoteEvent();

    selectDayEvent?.onEvent('CalendarComponent', (day) => selectDay(day));
    dailyNoteEvent?.onEvent('CalendarComponent', (day) => selectDay(day));

    React.useEffect(() => {
        const today = dateManager?.getCurrentDay();
        const currentMonth = dateManager?.getCurrentMonth();
        const currentYear = dateManager?.getCurrentYear();

        if (!today || !currentMonth || !currentYear) {
            return;
        }

        setViewState({
            currentYear: currentYear,
            currentMonth: currentMonth,
            selectedDay: today,
            today: today
        });
    }, [dateManager]);

    const openPeriodicNote(period: Period)

    const openYearlyNote = (year?: Year): void => yearlyNoteEvent?.emitEvent(year);
    const openQuarterlyNote = (quarter?: Month): void => quarterlyNoteEvent?.emitEvent(quarter);
    const openMonthlyNote = (month?: Month): void => monthlyNoteEvent?.emitEvent(month);
    const openWeeklyNote = (week?: Week): void => weeklyNoteEvent?.emitEvent(week);
    const openDailyNote = (day?: Day): void => dailyNoteEvent?.emitEvent(day);

    const selectDay = (day?: Day): void => {
        if (!day || !viewState) {
            return;
        }

        setViewState({
            ...viewState,
            selectedDay: day
        });
    };

    const navigateToNextMonth = (): void => {
        updateMonth(dateManager?.getNextMonth(viewState?.currentMonth));
    };

    const navigateToPreviousMonth = (): void => {
        updateMonth(dateManager?.getPreviousMonth(viewState?.currentMonth));
    };

    const navigateToCurrentMonth = (): void => {
        updateMonth(dateManager?.getCurrentMonth());
    };

    const updateMonth = (month?: Month): void => {
        const currentYear = dateManager?.getYear(month);

        if (!month || !currentYear || !viewState) {
            return;
        }

        setViewState({
            ...viewState,
            currentMonth: month,
            currentYear: currentYear
        });
    };

    return <CalendarViewModel>{
        viewState: viewState,
        openYearlyNote,
        openQuarterlyNote,
        openMonthlyNote,
        openWeeklyNote,
        openDailyNote,
        navigateToNextMonth,
        navigateToCurrentMonth,
        navigateToPreviousMonth,
    }
};

export interface CalendarViewState {
    currentYear: Year;
    currentMonth: Month;
    selectedDay: Day;
    today: Day;
}