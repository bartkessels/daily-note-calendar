import {Month} from 'src/domain/models/month';
import {Year} from 'src/domain/models/year';

export interface DateManager {
    getCurrentYear(): Year;
    getYear(month?: Month): Year;
    getCurrentMonth(): Month;
    getNextMonth(currentMonth?: Month): Month;
    getPreviousMonth(currentMonth?: Month): Month;
}