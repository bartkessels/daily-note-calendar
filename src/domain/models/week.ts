import {Day} from 'src/domain/models/day';
import {Period, PeriodProperty} from 'src/domain/models/period';

export interface Week extends Period<WeekProperty> {
    weekNumber: number,
    days: Day[]
}

export interface WeekProperty extends PeriodProperty {
    hasNote: boolean
}