import {Month} from 'src/domain/models/month';
import {Year} from 'src/domain/models/year';
import {Day} from 'src/domain/models/day';

export interface DateManager {
    getCurrentDay(): Day;
    getCurrentYear(): Promise<Year>;
    getYear(month?: Month): Promise<Year>;
    getMonth(day?: Day): Promise<Month>;
    getCurrentMonth(): Promise<Month>;
    getNextMonth(currentMonth?: Month): Promise<Month>;
    getPreviousMonth(currentMonth?: Month): Promise<Month>;
}