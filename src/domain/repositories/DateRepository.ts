import { Month } from "../models/Month";

export interface DateRepository {
    getMonth(year: number, month: number): Month;
}
