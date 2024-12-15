import {Week} from 'src/domain/models/week';
import {createDayUiModel, DayUiModel} from 'src/components/day.ui-model';
import {Day} from 'src/domain/models/day';

export interface WeekUiModel {
    week: Week;
    days: DayUiModel[];
    hasNote: boolean;
}

export function createWeekUiModel(week: Week, selectedDay?: Day): WeekUiModel {
    return <WeekUiModel>{
        week: week,
        days: week.days.map(day => createDayUiModel(day, selectedDay)),
        hasNote: false
    };
}