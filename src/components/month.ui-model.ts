import {Month} from 'src/domain/models/month';
import {createWeekUiModel, WeekUiModel} from 'src/components/week.ui-model';
import {Day} from 'src/domain/models/day';

export interface MonthUiModel {
    month?: Month;
    weeks: WeekUiModel[];
}

export function createMonthUiModel(month?: Month, selectedDay?: Day): MonthUiModel {
    return <MonthUiModel>{
        month: month,
        weeks: month?.weeks.map(week => createWeekUiModel(week, selectedDay))
    };
}