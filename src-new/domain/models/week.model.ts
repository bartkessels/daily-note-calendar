import {Period} from 'src-new/domain/models/period.model';

export interface WeekModel extends Period {
    date: Date;
    weekNumber: number;
    year: Period;
    month: Period;
    days: Period[]
}

export enum DayOfWeek {
    Sunday = 0,
    Monday = 1,
    Tuesday = 2,
    Wednesday = 3,
    Thursday = 4,
    Friday = 5,
    Saturday = 6
}