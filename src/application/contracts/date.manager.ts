import {Day} from 'src/domain/models/day';
import {Week} from 'src/domain/models/week';
import {Month} from 'src/domain/models/month';
import {Year} from 'src/domain/models/year';
import {Quarter} from 'src/domain/models/quarter';

export interface DateManager {
    getCurrentDay(): Day;
    getCurrentWeek(): Week;
    getCurrentMonth(): Month;
    getCurrentQuarter(): Quarter;
    getCurrentYear(): Year;
}