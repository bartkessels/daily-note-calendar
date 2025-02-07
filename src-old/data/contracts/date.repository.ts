import {Day} from 'src-old/domain/models/day';
import {Week} from 'src-old/domain/models/week';
import {Year} from 'src-old/domain/models/year';
import {Month} from 'src-old/domain/models/month';

export interface DateRepository {
    getDay(date: Date): Promise<Day>;
    getWeek(year: number, week: number): Promise<Week>;
    getMonth(year: number, month: number): Promise<Month>;
    getYear(year: number): Promise<Year>;
}