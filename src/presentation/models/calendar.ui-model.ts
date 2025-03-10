import {DayOfWeek, WeekModel} from 'src/domain/models/week.model';
import {periodUiModel, PeriodUiModel} from 'src/presentation/models/period.ui-model';
import {Period} from 'src/domain/models/period.model';
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

export function calendarUiModel(firstDayOfWeek: DayOfWeek, selectedPeriod?: Period, today?: Period): CalendarUiModel {
    const selectedPeriodUiModel = selectedPeriod ? periodUiModel(selectedPeriod) : undefined;
    const todayUiModel = today ? periodUiModel(today) : undefined;

    return <CalendarUiModel>{
        lastUpdateRequest: new Date(),
        today: todayUiModel,
        startWeekOnMonday: firstDayOfWeek === DayOfWeek.Monday,
        selectedPeriod: selectedPeriodUiModel,
        weeks: []
    };
}