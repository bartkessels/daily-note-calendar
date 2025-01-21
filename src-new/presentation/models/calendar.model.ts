import {WeekModel} from 'src-new/domain/models/week.model';
import {Period} from 'src-new/domain/models/date.model';

export interface CalendarModel {
    weeks: WeekModel[];
    selectedPeriod: Period;
    currentDay: Period;
}