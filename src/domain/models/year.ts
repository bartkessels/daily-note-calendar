import {Month} from 'src/domain/models/month';
import {Period} from 'src/domain/models/period';

export interface Year extends Period {
    name: string,
    months: Month[]
}
