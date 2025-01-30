import {DayOfWeek, WeekModel} from 'src-new/domain/models/week.model';
import {Period} from 'src-new/domain/models/period.model';

export interface DateManager {
    getCurrentDay(): Period;
    getCurrentWeek(startOfWeek: DayOfWeek): WeekModel;
    getPreviousWeeks(startOfWeek: DayOfWeek, currentWeek: WeekModel, noWeeks: number): WeekModel[];
    getNextWeeks(startOfWeek: DayOfWeek, currentWeek: WeekModel, noWeeks: number): WeekModel[];
}