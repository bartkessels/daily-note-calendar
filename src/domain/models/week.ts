import {Day} from 'src/domain/models/day';

export interface Week {
    weekNumber: number,
    days: Day[]
}