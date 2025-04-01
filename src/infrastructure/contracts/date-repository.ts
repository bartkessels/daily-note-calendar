import {DayOfWeek, WeekModel, WeekNumberStandard} from 'src/domain/models/week.model';
import {Period} from 'src/domain/models/period.model';

export interface DateRepository {
    getDayFromDate(date: Date): Period;
    getDayFromDateString(dateString: string, dateTemplate: string): Period | null;
    getWeekFromDate(startOfWeek: DayOfWeek, standard: WeekNumberStandard, date: Date): WeekModel;
    getPreviousWeek(startOfWeek: DayOfWeek, standard: WeekNumberStandard, week: WeekModel): WeekModel;
    getNextWeek(startOfWeekDay: DayOfWeek, standard: WeekNumberStandard, week: WeekModel): WeekModel;
    getMonthFromDate(date: Date): Period;
    getPreviousMonth(period: Period): Period;
    getNextMonth(period: Period): Period;
    getQuarter(month: Period): Period;
}