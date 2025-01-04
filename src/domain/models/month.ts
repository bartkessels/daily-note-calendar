import {Week} from 'src/domain/models/week';
import {Period} from 'src/domain/models/period';
import {Quarter} from 'src/domain/models/quarter';

export interface Month extends Period {
    quarter: Quarter,
    name: string,
    weeks: Week[]
}
