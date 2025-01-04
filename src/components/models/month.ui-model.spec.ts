import { createMonthUiModel, MonthUiModel } from 'src/components/models/month.ui-model';
import { Month } from 'src/domain/models/month';
import { Day } from 'src/domain/models/day';
import 'src/extensions/extensions';

describe('createMonthUiModel', () => {
    let month: Month;
    let selectedDay: Day;

    beforeEach(() => {
        month = {
            date: new Date(2023, 9),
            quarter: {
                date: new Date(2023, 9),
                quarter: 4,
                year: 2023
            },
            name: 'October',
            weeks: [
                {
                    date: new Date(2023, 9, 1),
                    weekNumber: '40',
                    days: [
                        { dayOfWeek: 1, date: new Date(2023, 9, 2), name: '2' },
                        { dayOfWeek: 2, date: new Date(2023, 9, 3), name: '3' },
                    ]
                }
            ]
        };

        selectedDay = { dayOfWeek: 1, date: new Date(2023, 9, 2), name: '2' };
    });

    it('creates a MonthUiModel with the provided month and selected day', () => {
        const result: MonthUiModel = createMonthUiModel(month, selectedDay);

        expect(result.month).toBe(month);
        expect(result.weeks.length).toBe(1);
        expect(result.weeks[0].days.length).toBeGreaterThanOrEqual(1);
        expect(result.weeks[0].days[0].isSelected).toBe(true);
    });

    it('creates a MonthUiModel with the provided month and no selected day', () => {
        const result: MonthUiModel = createMonthUiModel(month);

        expect(result.month).toBe(month);
        expect(result.weeks.length).toBe(1);
        expect(result.weeks[0].days.length).toBeGreaterThanOrEqual(1);
        expect(result.weeks[0].days[0].isSelected).toBe(false);
    });

    it('creates a MonthUiModel with empty weeks if month has no weeks', () => {
        const emptyMonth: Month = { date: new Date(2023, 9), quarter: { date: new Date(2023, 9), quarter: 4, year: 2023 }, name: 'October', weeks: [] };
        const result: MonthUiModel = createMonthUiModel(emptyMonth);

        expect(result.month).toBe(emptyMonth);
        expect(result.weeks.length).toBe(0);
    });
});