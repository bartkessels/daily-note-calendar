import {Period, PeriodProperty} from 'src/domain/models/period';

export interface PeriodEnhancer<P extends PeriodProperty> {
    enhance(period: Period<P>): Promise<Period<P>>;
}