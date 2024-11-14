import {Month} from 'src/domain/models/month';

export interface DateRepository {
    getMonth(year: number, month: number): Month;
}
