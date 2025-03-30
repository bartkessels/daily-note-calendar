import {PeriodUiModel} from 'src/presentation/models/period.ui-model';
import {WeekUiModel} from 'src/presentation/models/week.ui-model';

export interface CalendarUiModel {
    lastUpdateRequest: Date;
    startWeekOnMonday: boolean;
    selectedPeriod?: PeriodUiModel;
    today?: PeriodUiModel;
    weeks: WeekUiModel[];
    month?: PeriodUiModel;
    quarter?: PeriodUiModel;
    year?: PeriodUiModel;
}
