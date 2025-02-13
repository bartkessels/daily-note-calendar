import {DayOfWeek, WeekModel} from 'src/domain/models/week.model';
import {Period} from 'src/domain/models/period.model';

export interface DateManager {
    getCurrentDay(): Period;
    getTomorrow(): Period;
    getYesterday(): Period;
    getCurrentWeek(startOfWeek: DayOfWeek): WeekModel;
    getWeek(period: Period, startOfWeek: DayOfWeek): WeekModel;
    getPreviousWeeks(startOfWeek: DayOfWeek, currentWeek: WeekModel, noWeeks: number): WeekModel[];
    getNextWeeks(startOfWeek: DayOfWeek, currentWeek: WeekModel, noWeeks: number): WeekModel[];
    getQuarter(month: Period): Period;
}