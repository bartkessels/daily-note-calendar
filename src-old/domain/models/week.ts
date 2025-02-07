import {Day} from 'src-old/domain/models/day';
import {Period} from 'src-old/domain/models/period';

export interface Week extends Period {
    weekNumber: string,
    days: Day[]
}
