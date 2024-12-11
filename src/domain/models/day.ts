export interface Day {
    dayOfWeek: DayOfWeek,
    date: number,
    name: string,
    completeDate: Date
}

export function dayEquals(dayA?: Day, dayB?: Day): boolean {
    if (!dayA || !dayB) {
        return false;
    }

    return dayA.completeDate.toDateString() === dayB.completeDate.toDateString();
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
