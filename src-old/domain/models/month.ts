import {Week} from 'src-old/domain/models/week';
import {Period} from 'src-old/domain/models/period';
import {Quarter} from 'src-old/domain/models/quarter';

export interface Month extends Period {
    quarter: Quarter,
    name: string,
    weeks: Week[]
}
