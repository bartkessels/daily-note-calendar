import {DayOfWeek, WeekModel} from 'src-new/domain/models/week.model';
import {Period} from 'src-new/domain/models/period.model';

export interface CalendarModel {
    firstDayOfWeek: DayOfWeek;
    weeks: WeekModel[];
    selectedPeriod?: Period;
    currentDay?: Period;
}

export function createEmptyCalendarModel(firstDayOfWeek: DayOfWeek): CalendarModel {
    return {
        firstDayOfWeek: firstDayOfWeek,
        weeks: []
    };
}