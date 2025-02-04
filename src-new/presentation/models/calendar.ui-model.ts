import {DayOfWeek, WeekModel} from 'src-new/domain/models/week.model';
import {periodUiModel, PeriodUiModel} from 'src-new/presentation/models/period.ui-model';
import {weekUiModel, WeekUiModel} from 'src-new/presentation/models/week.ui-model';
import {Period} from 'src-new/domain/models/period.model';

export interface CalendarUiModel {
    startWeekOnMonday: boolean;
    selectedPeriod?: PeriodUiModel;
    month?: PeriodUiModel;
    year?: PeriodUiModel;
    weeks: WeekUiModel[];
}

export function calendarUiModel(firstDayOfWeek: DayOfWeek, weeks: WeekModel[], selectedPeriod?: Period): CalendarUiModel {
    let selectedPeriodUiModel = selectedPeriod ? periodUiModel(selectedPeriod) : undefined;

    return {
        startWeekOnMonday: firstDayOfWeek === DayOfWeek.Monday,
        selectedPeriod: selectedPeriodUiModel,
        weeks: weeks.map(weekUiModel)
    };
}