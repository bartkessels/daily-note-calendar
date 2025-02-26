import {DayOfWeek, WeekModel} from 'src/domain/models/week.model';
import {periodUiModel, PeriodUiModel} from 'src/presentation/models/period.ui-model';
import {weekUiModel, WeekUiModel} from 'src/presentation/models/week.ui-model';
import {Period} from 'src/domain/models/period.model';
import {PeriodViewState} from 'src/presentation/view-states/period.view-state';

export interface CalendarUiModel {
    lastUpdateRequest: Date;
    startWeekOnMonday: boolean;
    selectedPeriod?: PeriodViewState;
    today?: PeriodUiModel;
    month?: PeriodUiModel;
    year?: PeriodUiModel;
    quarter?: PeriodUiModel;
    weeks: WeekUiModel[];
}

export function calendarUiModel(firstDayOfWeek: DayOfWeek, weeks: WeekModel[], selectedPeriod?: Period, today?: Period): CalendarUiModel {
    const selectedPeriodUiModel = selectedPeriod ? periodUiModel(selectedPeriod) : undefined;
    const todayUiModel = today ? periodUiModel(today) : undefined;

    return {
        lastUpdateRequest: new Date(),
        today: todayUiModel,
        startWeekOnMonday: firstDayOfWeek === DayOfWeek.Monday,
        selectedPeriod: selectedPeriodUiModel,
        weeks: weeks.map(weekUiModel)
    };
}