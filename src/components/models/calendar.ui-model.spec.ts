import { createCalendarUiModel, CalendarUiModel } from 'src/components/calendar.ui-model';
import { Year } from 'src/domain/models/year';
import {MonthUiModel} from 'src/components/models/month.ui-model';
import {Month} from 'src/domain/models/month';

describe('createCalendarUiModel', () => {
    it('creates a CalendarUiModel with the provided year and month', () => {
        const month: Month = { date: new Date(2023, 9), name: 'October', weeks: [] };
        const year: Year = { date: new Date(2023, 0), name: '2023', months: [month] };
        const uiModel: MonthUiModel = { month: { date: new Date(2023, 9), name: 'October' }, weeks: [] };

        const result: CalendarUiModel = createCalendarUiModel(year, month);

        expect(result.currentYear).toBe(year);
        expect(result.currentMonth).toBe(uiModel);
    });

    it('creates a CalendarUiModel with undefined year and month if not provided', () => {
        const result: CalendarUiModel = createCalendarUiModel();

        expect(result.currentYear).toBeUndefined();
        expect(result.currentMonth).toBeUndefined();
    });
});