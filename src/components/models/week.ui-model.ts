import {Week} from 'src/domain/models/week';
import {createDayUiModel, DayUiModel, EMPTY_DAY} from 'src/components/models/day.ui-model';
import {Day, DayOfWeek} from 'src/domain/models/day';

export interface WeekUiModel {
    week: Week;
    days: DayUiModel[];
    hasNote: boolean;
}

export function createWeekUiModel(week: Week, selectedDay?: Day): WeekUiModel {
    const days = week.days.map(day => createDayUiModel(day, selectedDay));

    return <WeekUiModel>{
        week: week,
        days: sortDays(days),
        hasNote: false
    };
}

function sortDays(days: DayUiModel[]): DayUiModel[] {
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
        days.find((day) => day.currentDay?.date.getDay() === dayOfWeek) ?? EMPTY_DAY
    );
}
