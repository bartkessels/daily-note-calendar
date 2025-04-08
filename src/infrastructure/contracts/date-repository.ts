import {DayOfWeek, Week, WeekNumberStandard} from 'src/domain/models/week';
import {Period} from 'src/domain/models/period.model';

export interface DateRepository {
    getDayFromDate(date: Date): Period;
    getDayFromDateString(dateString: string, dateTemplate: string): Period | null;
    getWeekFromDate(startOfWeek: DayOfWeek, standard: WeekNumberStandard, date: Date): Week;
    getPreviousWeek(startOfWeek: DayOfWeek, standard: WeekNumberStandard, week: Week): Week;
    getNextWeek(startOfWeekDay: DayOfWeek, standard: WeekNumberStandard, week: Week): Week;
    getMonthFromDate(date: Date): Period;
    getPreviousMonth(period: Period): Period;
    getNextMonth(period: Period): Period;
    getQuarter(month: Period): Period;
    getDaysForPeriod(startOfWeekDay: DayOfWeek, period: Period): Period[];
}