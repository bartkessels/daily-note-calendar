import {Day} from 'src/domain/models/day';
import {Period} from 'src/domain/models/period';

export interface Week extends Period {
    weekNumber: number,
    days: Day[]
}
