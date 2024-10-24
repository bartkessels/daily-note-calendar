import { Day } from "./Day";
import { Week } from "./Week";

export interface Month {
    monthIndex: number,
    name: string,
    number: number,
    weeks: Week[]
}