import {Year} from 'src/domain/models/year';
import {createMonthUiModel, MonthUiModel} from 'src/components/models/month.ui-model';
import {Month} from 'src/domain/models/month';

export interface CalendarUiModel {
    currentMonth?: MonthUiModel;
    currentYear?: Year;
}

export function createCalendarUiModel(currentYear: Year, currentMonth: Month): CalendarUiModel {
    return <CalendarUiModel>{
        currentYear: currentYear,
        currentMonth: createMonthUiModel(currentMonth)
    };
}