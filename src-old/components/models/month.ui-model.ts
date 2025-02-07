import {Month} from 'src-old/domain/models/month';
import {Day} from 'src-old/domain/models/day';
import {createWeekUiModel, WeekUiModel} from 'src-old/components/models/week.ui-model';

export interface MonthUiModel {
    month?: Month;
    weeks: WeekUiModel[];
}

export function createMonthUiModel(month: Month, selectedDay?: Day): MonthUiModel {
    return <MonthUiModel>{
        month: month,
        weeks: month.weeks.map(week => createWeekUiModel(week, selectedDay))
    };
}