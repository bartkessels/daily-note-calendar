import {Day} from 'src/domain/models/day';
import {Week} from 'src/domain/models/week';
import {Year} from 'src/domain/models/year';
import {Month} from 'src/domain/models/month';

export interface DateRepository {
    getDay(date: Date): Promise<Day>;
    getWeek(year: number, week: number): Promise<Week>;
    getMonth(year: number, month: number): Promise<Month>;
    getYear(year: number): Promise<Year>;
}