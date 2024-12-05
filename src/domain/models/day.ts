import {Period, PeriodProperty} from 'src/domain/models/period';

export interface Day extends Period<DayProperty> {
    dayOfWeek: DayOfWeek,
    name: string,
}

export enum DayOfWeek {
    Monday = 1,
    Tuesday = 2,
    Wednesday = 3,
    Thursday = 4,
    Friday = 5,
    Saturday = 6,
    Sunday = 0
}

export interface DayProperty extends PeriodProperty {
    hasPeriodicNote: boolean
}