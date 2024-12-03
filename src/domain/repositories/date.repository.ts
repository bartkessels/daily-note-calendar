import { Month } from "../models/month";
import {Year} from 'src/domain/models/year';
import {Day} from 'src/domain/models/day';

export interface DateRepository {
    getDay(date: Date): Day;
    getYear(year: number): Year;
    getMonth(year: number, monthIndex: number): Month;
}
