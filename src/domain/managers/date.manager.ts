import { Month } from "../models/Month";

export interface DateManager {
    getCurrentMonth(): Month;
    getNextMonth(currentMonth?: Month): Month;
    getPreviousMonth(currentMonth?: Month): Month;
}