import {Period} from 'src/domain/models/period.model';
import {Week} from 'src/domain/models/week';

export interface Calendar {
    startWeekOnMonday: boolean;
    month: Period;
    quarter: Period;
    year: Period;
    weeks: Week[];
    today: Period;
}