import {Week} from 'src/domain/models/week';
import {Period, PeriodProperty} from 'src/domain/models/period';

export interface Month extends Period<MonthProperty> {
    quarter: number,
    name: string,
    weeks: Week[]
}

export interface MonthProperty extends PeriodProperty {}