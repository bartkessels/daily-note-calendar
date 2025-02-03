export interface Period {
    date: Date;
    name: string;
    type: PeriodType;
}

export enum PeriodType {
    Day,
    Week,
    Month,
    Year
}