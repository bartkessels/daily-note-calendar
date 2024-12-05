export interface Day {
    dayOfWeek: DayOfWeek,
    date: number,
    name: string,
    completeDate: Date,
    properties: Property[]
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

export interface Property {}

export interface IndicatorProperty extends Property {
    hasPeriodicNote: boolean
}