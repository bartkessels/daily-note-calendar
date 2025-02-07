import {Day} from 'src-old/domain/models/day';
import {Week} from 'src-old/domain/models/week';
import {Month} from 'src-old/domain/models/month';
import {Year} from 'src-old/domain/models/year';
import {Quarter} from 'src-old/domain/models/quarter';

export interface DateManager {
    getCurrentDay(): Day;
    getCurrentWeek(): Week;
    getCurrentMonth(): Month;
    getCurrentQuarter(): Quarter;
    getCurrentYear(): Year;
}