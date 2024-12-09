import {Week} from 'src/domain/models/week';
import {Period} from 'src/domain/models/period';

export interface Month extends Period {
    quarter: number,
    name: string,
    weeks: Week[]
}
