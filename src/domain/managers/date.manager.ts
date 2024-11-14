import {Month} from 'src/domain/models/month';

export interface DateManager {
    getCurrentMonth(): Month;
    getNextMonth(currentMonth?: Month): Month;
    getPreviousMonth(currentMonth?: Month): Month;
}