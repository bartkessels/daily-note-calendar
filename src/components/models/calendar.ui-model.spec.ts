import { createCalendarUiModel, CalendarUiModel } from 'src/components/models/calendar.ui-model';
import { Year } from 'src/domain/models/year';
import {MonthUiModel} from 'src/components/models/month.ui-model';
import {Month} from 'src/domain/models/month';

describe('createCalendarUiModel', () => {
    it('creates a CalendarUiModel with the provided year and month', () => {
        const month: Month = { date: new Date(2023, 9), quarter: { date: new Date(2023), quarter: 3, year: 2023 }, name: 'October', weeks: [] };
        const year: Year = { date: new Date(2023, 0), name: '2023', months: [month] };
        const uiModel: MonthUiModel = { month: month, weeks: [] };

        const result: CalendarUiModel = createCalendarUiModel(year, month);

        expect(result.currentYear).toBe(year);
        expect(result.currentMonth).toEqual(uiModel);
        expect(result.startWeekOnMonday).toBe(true);
    });
});