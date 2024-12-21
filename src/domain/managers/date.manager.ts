import {Month} from 'src/domain/models/month';
import {Year} from 'src/domain/models/year';
import {Day} from 'src/domain/models/day';

export interface DateManager {
    getCurrentDay(): Day;
    getCurrentYear(): Year;
    getYear(month?: Month): Year;
    getCurrentMonth(): Month;
    getNextMonth(currentMonth?: Month): Month;
    getPreviousMonth(currentMonth?: Month): Month;
}