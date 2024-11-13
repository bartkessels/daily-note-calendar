import { Week } from "./week";

export interface Month {
    monthIndex: number,
    year: number,
    name: string,
    number: number,
    weeks: Week[]
}