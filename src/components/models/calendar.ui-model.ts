import {Year} from 'src/domain/models/year';
import {createMonthUiModel, MonthUiModel} from 'src/components/models/month.ui-model';
import {Month} from 'src/domain/models/month';
import { Day } from 'src/domain/models/day';

export interface CalendarUiModel {
    currentMonth?: MonthUiModel;
    currentYear?: Year;
    startWeekOnMonday: boolean;
}

export function createCalendarUiModel(currentYear: Year, currentMonth: Month, selectedDay?: Day): CalendarUiModel {
    return <CalendarUiModel>{
        currentYear: currentYear,
        currentMonth: createMonthUiModel(currentMonth, selectedDay),
        startWeekOnMonday: true
    };
}