import {WeekModel} from 'src-new/domain/models/week.model';
import {Period} from 'src-new/domain/models/period.model';

export interface DateService {
    getWeekFromDate(date: Date): WeekModel;
    getWeek(weekNumber: number, year: number): WeekModel;
    getPreviousWeek(week: WeekModel): WeekModel;
    getNextWeek(week: WeekModel): WeekModel;
    getQuarter(month: Period): Period;
}