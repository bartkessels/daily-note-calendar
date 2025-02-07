import {Month} from 'src-old/domain/models/month';
import {Year} from 'src-old/domain/models/year';
import {Day} from 'src-old/domain/models/day';

export interface DateManager {
    getCurrentDay(): Day;
    getCurrentYear(): Promise<Year>;
    getYear(month?: Month): Promise<Year>;
    getMonth(day?: Day): Promise<Month>;
    getCurrentMonth(): Promise<Month>;
    getNextMonth(currentMonth?: Month): Promise<Month>;
    getPreviousMonth(currentMonth?: Month): Promise<Month>;
}