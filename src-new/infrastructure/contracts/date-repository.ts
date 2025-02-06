import {DayOfWeek, WeekModel} from 'src-new/domain/models/week.model';
import {Period} from 'src-new/domain/models/period.model';

export interface DateRepository {
    getDayFromDate(date: Date): Period;
    getWeekFromDate(startOfWeek: DayOfWeek, date: Date): WeekModel;
    getWeek(startOfWeek: DayOfWeek, weekNumber: number, year: number): WeekModel;
    getPreviousWeek(startOfWeek: DayOfWeek, week: WeekModel): WeekModel;
    getNextWeek(startOfWeek: DayOfWeek, week: WeekModel): WeekModel;
    getQuarter(month: Period): Period;
}