import {PeriodUiModel} from 'src/presentation/models/period.ui-model';
import {WeekModel} from 'src/domain/models/week.model';

export interface WeekUiModel extends PeriodUiModel {
    period: WeekModel;
    weekNumber: number;
    year: PeriodUiModel;
    quarter: PeriodUiModel;
    month: PeriodUiModel;
    days: PeriodUiModel[];
}
