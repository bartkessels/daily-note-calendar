import {Week} from 'src-old/domain/models/week';
import {createDayUiModel, DayUiModel} from 'src-old/components/models/day.ui-model';
import {Day} from 'src-old/domain/models/day';

export interface WeekUiModel {
    week: Week;
    days: DayUiModel[];
    hasNote: boolean;
}

export function createWeekUiModel(week: Week, selectedDay?: Day): WeekUiModel {
    const days = week.days.map(day => createDayUiModel(day, selectedDay));

    return <WeekUiModel>{
        week: week,
        days: days,
        hasNote: false
    };
}
