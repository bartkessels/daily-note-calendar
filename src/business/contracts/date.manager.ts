import {Period} from 'src/domain/models/period.model';
import { DayOfWeek, Week, WeekNumberStandard } from 'src/domain/models/week';

export interface DateManager {
    getCurrentDay(): Period;
    getTomorrow(): Period;
    getYesterday(): Period;
    getCurrentWeek(startOfWeek: DayOfWeek, standard: WeekNumberStandard): Week;
    getWeek(period: Period, startOfWeek: DayOfWeek, standard: WeekNumberStandard): Week;
    getPreviousWeeks(currentWeek: Week, startOfWeek: DayOfWeek, standard:WeekNumberStandard, noWeeks: number): Week[];
    getNextWeeks(currentWeek: Week, startOfWeek: DayOfWeek, standard: WeekNumberStandard, noWeeks: number): Week[];
    getNextMonth(month: Period, startOfWeek: DayOfWeek, standard: WeekNumberStandard): Week[];
    getPreviousMonth(month: Period, startOfWeek: DayOfWeek, standard: WeekNumberStandard): Week[];
    getMonth(day: Period): Period;
    getQuarter(month: Period): Period;
    getYear(day: Period): Period;
}
