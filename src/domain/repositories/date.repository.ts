import { Month } from "../models/month";
import {Year} from 'src/domain/models/year';

export interface DateRepository {
    getYear(year: number): Year;
    getMonth(year: number, month: number): Month;
}
