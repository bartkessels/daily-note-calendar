import {Week} from './week.model';
import {Day, DayOfWeek} from 'src/domain/models/day';
import {getWeeklyNoteEvent} from 'src/components/providers/weekly-note-event.context';

export interface WeekViewModel {
    openWeeklyNote: (week?: Week) => void;
    sortDays: (week: Week) => Day[];
}

export const useWeekViewModel = (): WeekViewModel => {
    const weeklyNoteEvent = getWeeklyNoteEvent();

    const openWeeklyNote = (week?: Week): void => weeklyNoteEvent?.emitEvent(week);

    const sortDays = (week: Week): Day[] => {
        const WEEK_DAYS_ORDER = [
            DayOfWeek.Monday,
            DayOfWeek.Tuesday,
            DayOfWeek.Wednesday,
            DayOfWeek.Thursday,
            DayOfWeek.Friday,
            DayOfWeek.Saturday,
            DayOfWeek.Sunday
        ];

        return WEEK_DAYS_ORDER.map((dayOfWeek) =>
            week?.days.find((day) => day.date.getDay() === dayOfWeek
        ));
    };

    return <WeekViewModel>{
        openWeeklyNote,
        sortDays
    };
};