import {DayOfWeek, WeekModel, WeekNumberStandard} from 'src/domain/models/week.model';
import {Period} from 'src/domain/models/period.model';

export interface DateManager {
    getCurrentDay(): Period;
    getTomorrow(): Period;
    getYesterday(): Period;
    getCurrentWeek(startOfWeek: DayOfWeek, standard: WeekNumberStandard): WeekModel;
    getWeek(period: Period, startOfWeek: DayOfWeek, standard: WeekNumberStandard): WeekModel;
    getPreviousWeeks(currentWeek: WeekModel, startOfWeek: DayOfWeek, standard:WeekNumberStandard, noWeeks: number): WeekModel[];
    getNextWeeks(currentWeek: WeekModel, startOfWeek: DayOfWeek, standard: WeekNumberStandard, noWeeks: number): WeekModel[];
    getNextMonth(month: Period, startOfWeek: DayOfWeek, standard: WeekNumberStandard): WeekModel[];
    getPreviousMonth(month: Period, startOfWeek: DayOfWeek, standard: WeekNumberStandard): WeekModel[];
    getQuarter(month: Period): Period;
}