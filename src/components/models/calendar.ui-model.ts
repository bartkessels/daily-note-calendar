import {Year} from 'src/domain/models/year';
import {MonthUiModel} from 'src/components/month.ui-model';

export interface CalendarUiModel {
    currentMonth?: MonthUiModel;
    currentYear?: Year;
}

export function createCalendarUiModel(currentYear?: Year, currentMonth?: MonthUiModel): CalendarUiModel {
    return <CalendarUiModel>{
        currentYear: currentYear,
        currentMonth: currentMonth
    };
}