import {Period} from 'src/domain/models/period.model';

export interface Week extends Period {
    weekNumber: number;
    year: Period;
    quarter: Period;
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

export enum WeekNumberStandard {
    ISO = 0,
    US = 1
}