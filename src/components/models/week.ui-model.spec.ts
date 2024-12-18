import { createWeekUiModel, WeekUiModel } from 'src/components/models/week.ui-model';
import { Week } from 'src/domain/models/week';
import { Day, DayOfWeek } from 'src/domain/models/day';
import 'src/extensions/extensions';
import {EMPTY_DAY} from 'src/components/models/day.ui-model';

describe('createWeekUiModel', () => {
    let week: Week;
    let selectedDay: Day;

    beforeEach(() => {
        week = {
            date: new Date(2023, 9, 1),
            weekNumber: 40,
            days: [
                { dayOfWeek: DayOfWeek.Monday, date: new Date(2023, 9, 2), name: '2' },
                { dayOfWeek: DayOfWeek.Tuesday, date: new Date(2023, 9, 3), name: '3' },
                { dayOfWeek: DayOfWeek.Wednesday, date: new Date(2023, 9, 4), name: '4' },
                { dayOfWeek: DayOfWeek.Thursday, date: new Date(2023, 9, 5), name: '5' },
                { dayOfWeek: DayOfWeek.Friday, date: new Date(2023, 9, 6), name: '6' },
                { dayOfWeek: DayOfWeek.Saturday, date: new Date(2023, 9, 7), name: '7' },
                { dayOfWeek: DayOfWeek.Sunday, date: new Date(2023, 9, 8), name: '8' },
            ]
        };

        selectedDay = { dayOfWeek: DayOfWeek.Monday, date: new Date(2023, 9, 2), name: '2' };
    });

    it('creates a WeekUiModel with the provided week and selected day', () => {
        const result: WeekUiModel = createWeekUiModel(week, selectedDay);

        expect(result.week).toBe(week);
        expect(result.days.length).toBe(7);
        expect(result.days[0].isSelected).toBe(true);
    });

    it('creates a WeekUiModel with the provided week and no selected day', () => {
        const result: WeekUiModel = createWeekUiModel(week);

        expect(result.week).toBe(week);
        expect(result.days.length).toBe(7);
        expect(result.days[0].isSelected).toBe(false);
    });

    it('sets hasNote to false by default', () => {
        const result: WeekUiModel = createWeekUiModel(week);

        expect(result.hasNote).toBe(false);
    });

    it('sorts the days in the correct order', () => {
        const weekWithWrongDayOrder = { ...week,
            days: [
                { dayOfWeek: DayOfWeek.Sunday, date: new Date(2023, 9, 8), name: '8' },
                { dayOfWeek: DayOfWeek.Monday, date: new Date(2023, 9, 2), name: '2' },
                { dayOfWeek: DayOfWeek.Tuesday, date: new Date(2023, 9, 3), name: '3' },
                { dayOfWeek: DayOfWeek.Thursday, date: new Date(2023, 9, 5), name: '5' },
                { dayOfWeek: DayOfWeek.Friday, date: new Date(2023, 9, 6), name: '6' },
                { dayOfWeek: DayOfWeek.Saturday, date: new Date(2023, 9, 7), name: '7' },
                { dayOfWeek: DayOfWeek.Wednesday, date: new Date(2023, 9, 4), name: '4' },
            ]
        };
        const result: WeekUiModel = createWeekUiModel(weekWithWrongDayOrder);

        expect(result.days[0].currentDay?.dayOfWeek).toBe(DayOfWeek.Monday);
        expect(result.days[1].currentDay?.dayOfWeek).toBe(DayOfWeek.Tuesday);
        expect(result.days[2].currentDay?.dayOfWeek).toBe(DayOfWeek.Wednesday);
        expect(result.days[3].currentDay?.dayOfWeek).toBe(DayOfWeek.Thursday);
        expect(result.days[4].currentDay?.dayOfWeek).toBe(DayOfWeek.Friday);
        expect(result.days[5].currentDay?.dayOfWeek).toBe(DayOfWeek.Saturday);
        expect(result.days[6].currentDay?.dayOfWeek).toBe(DayOfWeek.Sunday);
    });

    it('maps days that arent from the current month as EMPTY_DAY', () => {
        const weekWithMissingDays: Week = {
            date: new Date(2024, 11, 1),
            weekNumber: 48,
            days: [
                { dayOfWeek: DayOfWeek.Sunday, date: new Date(2024, 11, 1), name: '1' },
            ]
        };
        const result: WeekUiModel = createWeekUiModel(weekWithMissingDays);

        expect(result.days[0]).toBe(EMPTY_DAY);
        expect(result.days[1]).toBe(EMPTY_DAY);
        expect(result.days[2]).toBe(EMPTY_DAY);
        expect(result.days[3]).toBe(EMPTY_DAY);
        expect(result.days[4]).toBe(EMPTY_DAY);
        expect(result.days[5]).toBe(EMPTY_DAY);
        expect(result.days[6]?.currentDay?.dayOfWeek).toBe(DayOfWeek.Sunday);
    });
});