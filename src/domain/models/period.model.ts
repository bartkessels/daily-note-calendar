export interface Period {
    date: Date;
    name: string;
    type: PeriodType;
}

export enum PeriodType {
    Day,
    Week,
    Month,
    Quarter,
    Year
}

export function arePeriodsEqual(periodA?: Period, periodB?: Period): boolean {
    if (!periodA || !periodB) {
        return false;
    }

    const areSameDate = periodA.date.toDateString() === periodB.date.toDateString();
    const areSameType = periodA.type === periodB.type;

    return areSameDate && areSameType;
}