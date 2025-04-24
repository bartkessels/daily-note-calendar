import {Period} from 'src/domain/models/period.model';
import {Week} from 'src/domain/models/week';

export interface Calendar {
    weekDays: string[];
    month: Period;
    quarter: Period;
    year: Period;
    weeks: Week[];
    today: Period | null;
}