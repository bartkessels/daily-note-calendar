import {Period} from 'src/domain/models/period';

export interface Quarter extends Period {
    quarter: number;
    year: number;
}