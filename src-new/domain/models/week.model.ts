import {DayModel} from 'src-new/domain/models/day.model';
import {MonthModel} from 'src-new/domain/models/month.model';

export interface WeekModel {
    date: Date;
    name: string;
    month: MonthModel;
    days: DayModel[]
}