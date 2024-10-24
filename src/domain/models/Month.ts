import { Week } from "./Week";

export interface Month {
    monthIndex: number,
    year: number,
    name: string,
    number: number,
    weeks: Week[]
}