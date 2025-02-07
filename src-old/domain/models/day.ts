import {Period} from 'src-old/domain/models/period';

export interface Day extends Period {
    dayOfWeek: DayOfWeek,
    name: string,
}

export function dayEquals(dayA?: Day, dayB?: Day): boolean {
    if (!dayA || !dayB) {
        return false;
    }

    return dayA.date.toDateString() === dayB.date.toDateString();
}

export function dayOfWeekName(dayOfWeek: DayOfWeek): string {
    switch (dayOfWeek) {
        case DayOfWeek.Monday:
            return 'Monday';
        case DayOfWeek.Tuesday:
            return 'Tuesday';
        case DayOfWeek.Wednesday:
            return 'Wednesday';
        case DayOfWeek.Thursday:
            return 'Thursday';
        case DayOfWeek.Friday:
            return 'Friday';
        case DayOfWeek.Saturday:
            return 'Saturday';
        case DayOfWeek.Sunday:
            return 'Sunday';
    }
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
