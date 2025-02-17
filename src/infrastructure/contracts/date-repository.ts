import {DayOfWeek, WeekModel} from 'src/domain/models/week.model';
import {Period} from 'src/domain/models/period.model';

export interface DateRepository {
    getDayFromDate(date: Date): Period;
    getDayFromDateString(dateString: string, dateTemplate: string): Period | null;
    getWeekFromDate(startOfWeek: DayOfWeek, date: Date): WeekModel;
    getPreviousWeek(startOfWeek: DayOfWeek, week: WeekModel): WeekModel;
    getNextWeek(startOfWeek: DayOfWeek, week: WeekModel): WeekModel;
    getQuarter(month: Period): Period;
}