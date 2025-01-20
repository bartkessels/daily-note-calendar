import {QuarterModel} from 'src-new/domain/models/quarter.model';

export interface MonthModel {
    date: Date;
    name: string;
    quarter: QuarterModel;
}