import {Year} from 'src/domain/models/year';
import {MonthUiModel} from 'src/components/month.ui-model';
import {Month} from 'src/domain/models/month';
import {Day} from 'src/domain/models/day';

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