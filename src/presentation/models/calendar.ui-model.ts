import {Period} from 'src/domain/models/period.model';
import {WeekModel} from 'src/domain/models/week.model';

export interface CalendarUiModel {
    lastUpdateRequest: Date;
    startWeekOnMonday: boolean;
    today: Period | null;
    weeks: WeekModel[];
    month: Period;
    quarter: Period;
    year: Period;
}
