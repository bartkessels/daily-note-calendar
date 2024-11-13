import { Month } from "../models/month";

export interface DateManager {
    getCurrentMonth(): Month;
    getNextMonth(currentMonth?: Month): Month;
    getPreviousMonth(currentMonth?: Month): Month;
}