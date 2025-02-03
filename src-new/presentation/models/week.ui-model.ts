import {periodUiModel, PeriodUiModel} from 'src-new/presentation/models/period.ui-model';
import {WeekModel} from 'src-new/domain/models/week.model';

export interface WeekUiModel extends PeriodUiModel {
    period: WeekModel;
    weekNumber: number;
    year: PeriodUiModel;
    month: PeriodUiModel;
    days: PeriodUiModel[];
}

export function weekUiModel(week: WeekModel): WeekUiModel {
    return {
        period: week,
        hasPeriodNote: false,
        noNotes: 0,
        weekNumber: week.weekNumber,
        year: periodUiModel(week),
        month: periodUiModel(week),
        days: week.days.map(periodUiModel),
    };
}