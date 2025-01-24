import {WeekModel} from 'src-new/domain/models/week.model';

export interface DateManager {
    getCurrentWeek(): WeekModel;
    getPreviousWeeks(currentWeek: WeekModel, noWeeks: number = 1): WeekModel[];
    getNextWeeks(currentWeek: WeekModel, noWeeks: number = 1): WeekModel[];
}