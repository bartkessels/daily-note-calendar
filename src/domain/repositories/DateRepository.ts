import { Month } from "../models/Month";
import { Year } from "../models/Year";

export interface DateRepository {
    getCurrentYear(): Year;
    getCurrentMonth(): Month;
    getYear(year: number): Year;
    getMonth(year: number, month: number): Month;
}
