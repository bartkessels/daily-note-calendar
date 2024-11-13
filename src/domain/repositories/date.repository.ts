import { Month } from "../models/month";

export interface DateRepository {
    getMonth(year: number, month: number): Month;
}
