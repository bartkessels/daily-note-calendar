import {YearModel} from 'src-new/domain/models/year.model';

export interface QuarterModel {
    date: Date;
    quarter: number;
    year: YearModel;
}