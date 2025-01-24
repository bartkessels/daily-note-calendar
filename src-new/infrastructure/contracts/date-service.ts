import {WeekModel} from 'src-new/domain/models/week.model';

export interface DateService {
    getWeekFromDate(date: Date): WeekModel;
    getWeek(weekNumber: number, year: number): WeekModel;
    getPreviousWeek(week: WeekModel): WeekModel;
    getNextWeek(week: WeekModel): WeekModel;
}