import { Day } from "../models/Day";
import { Month } from "../models/Month";

export interface DateRepository {
    getToday(): Date;
    getCurrentMonth(): Month;
    getMonth(year: number, month: number): Month;
    isToday(day?: Day): boolean;
}
