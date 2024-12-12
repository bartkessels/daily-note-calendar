import {getSelectDayEvent} from 'src/components/providers/select-day-event.context';
import { getDailyNoteEvent } from './providers/daily-note-event.context';
import {getWeeklyNoteEvent} from 'src/components/providers/weekly-note-event.context';
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
    init: () => void;
    openYearlyNote: (year?: Year) => void;
    openQuarterlyNote: (quarter?: Month) => void;
    openWeeklyNote: (week?: Week) => void;
}

export const useCalendarViewModel = (): CalendarViewModel => {
    const dateManager = useDateManager();
    const [viewState, setViewState] = React.useState<CalendarViewState>();

    const selectDayEvent = getSelectDayEvent();
    const dailyNoteEvent = getDailyNoteEvent();
    const weeklyNoteEvent = getWeeklyNoteEvent();
    const quarterlyNoteEvent = getQuarterlyNoteEvent();
    const yearlyNoteEvent = getYearlyNoteEvent();

    selectDayEvent?.onEvent('CalendarComponent', (day) => selectDay(day));
    dailyNoteEvent?.onEvent('CalendarComponent', (day) => selectDay(day));

    const init = (): void => React.useEffect(() => {
        const today = dateManager?.getCurrentDay();
        const currentYear = dateManager?.getCurrentYear();

        if (!today || !currentYear) {
            return;
        }

        setViewState({
            currentYear: currentYear,
            selectedDay: today,
            today: today
        });

        console.log('viewmodel has been initted');
    }, [dateManager]);

    const openYearlyNote = (year?: Year): void => yearlyNoteEvent?.emitEvent(year);
    const openQuarterlyNote = (quarter?: Month): void => quarterlyNoteEvent?.emitEvent(quarter);
    const openWeeklyNote = (week?: Week): void => weeklyNoteEvent?.emitEvent(week);

    const selectDay = (day?: Day): void => {
        if (!day || !viewState) {
            return;
        }

        setViewState({
            ...viewState,
            selectedDay: day
        });
    };

    return <CalendarViewModel>{
        viewState: viewState,
        init,
        openYearlyNote,
        openQuarterlyNote,
        openWeeklyNote,
    }
};

export interface CalendarViewState {
    currentYear: Year;
    // currentMonth: Month;
    selectedDay: Day;
    today: Day;
}