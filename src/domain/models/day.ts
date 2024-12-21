import {Period} from 'src/domain/models/period';

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

export enum DayOfWeek {
    Monday = 1,
    Tuesday = 2,
    Wednesday = 3,
    Thursday = 4,
    Friday = 5,
    Saturday = 6,
    Sunday = 0
}
