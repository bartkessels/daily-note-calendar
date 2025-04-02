import {DayOfWeek, Week} from 'src/domain/models/week';
import {Period} from 'src/domain/models/period.model';

export interface DateRepository {
    getDayFromDate(date: Date): Period;
    getDayFromDateString(dateString: string, dateTemplate: string): Period | null;
    getWeekFromDate(startOfWeek: DayOfWeek, date: Date): Week;
    getPreviousWeek(startOfWeek: DayOfWeek, week: Week): Week;
    getNextWeek(startOfWeekDay: DayOfWeek, week: Week): Week;
    getMonthFromDate(date: Date): Period;
    getPreviousMonth(period: Period): Period;
    getNextMonth(period: Period): Period;
    getQuarter(month: Period): Period;
}