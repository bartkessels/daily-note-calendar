import {Month} from 'src/domain/models/month';

export interface Year {
    year: number,
    name: string,
    months: Month[]
}