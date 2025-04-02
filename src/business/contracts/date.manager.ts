import {DayOfWeek, Week} from 'src/domain/models/week';
import {Period} from 'src/domain/models/period.model';

export interface DateManager {
    getCurrentDay(): Period;
    getTomorrow(): Period;
    getYesterday(): Period;
    getCurrentWeek(startOfWeek: DayOfWeek): Week;
    getWeek(period: Period, startOfWeek: DayOfWeek): Week;
    getPreviousWeeks(startOfWeek: DayOfWeek, currentWeek: Week, noWeeks: number): Week[];
    getNextWeeks(startOfWeek: DayOfWeek, currentWeek: Week, noWeeks: number): Week[];
    getNextMonth(month: Period, startOfWeek: DayOfWeek): Week[];
    getPreviousMonth(month: Period, startOfWeek: DayOfWeek): Week[];
    getQuarter(month: Period): Period;
}