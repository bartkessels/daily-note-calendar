import {Period} from 'src-old/domain/models/period';

export interface Quarter extends Period {
    quarter: number;
    year: number;
}