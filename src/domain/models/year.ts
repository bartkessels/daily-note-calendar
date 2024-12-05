import {Month} from 'src/domain/models/month';
import {Period, PeriodProperty} from 'src/domain/models/period';

export interface Year extends Period<YearProperty> {
    name: string,
    months: Month[]
}

export interface YearProperty extends PeriodProperty {}