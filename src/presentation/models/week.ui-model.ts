import {periodUiModel, PeriodUiModel} from 'src/presentation/models/period.ui-model';
import {WeekModel} from 'src/domain/models/week.model';

export interface WeekUiModel extends PeriodUiModel {
    period: WeekModel;
    weekNumber: number;
    year: PeriodUiModel;
    quarter: PeriodUiModel;
    month: PeriodUiModel;
    days: PeriodUiModel[];
}

export function weekUiModel(week: WeekModel): WeekUiModel {
    return {
        period: week,
        hasPeriodNote: false,
        notes: [],
        weekNumber: week.weekNumber,
        year: periodUiModel(week.year),
        quarter: periodUiModel(week.quarter),
        month: periodUiModel(week.month),
        days: week.days.map(periodUiModel),
    };
}