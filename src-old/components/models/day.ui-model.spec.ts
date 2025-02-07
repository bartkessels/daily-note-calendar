import {createDayUiModel, DayUiModel} from 'src-old/components/models/day.ui-model';
import {Day, DayOfWeek} from 'src-old/domain/models/day';
import 'src-old/extensions/extensions';

describe('createDayUiModel', () => {
    let day: Day;

    beforeEach(() => {
        day = { date: new Date(2023, 9, 2), dayOfWeek: DayOfWeek.Monday, name: '2' };
    });

    it('creates a DayUiModel with the provided day', () => {
        const result: DayUiModel = createDayUiModel(day);

        expect(result.currentDay).toBe(day);
        expect(result.isSelected).toBe(false);
        expect(result.isToday).toBe(false);
        expect(result.hasNote).toBe(false);
    });

    it('sets isSelected to true if the day is the selected day', () => {
        const result: DayUiModel = createDayUiModel(day, day);

        expect(result.isSelected).toBe(true);
    });

    it('sets isToday to true if the day is today', () => {
        jest.spyOn(day.date, 'isToday').mockReturnValue(true);

        const result: DayUiModel = createDayUiModel(day);

        expect(result.isToday).toBe(true);
    });

    it('sets isToday to false if the day is not today', () => {
        jest.spyOn(day.date, 'isToday').mockReturnValue(false);
        const result: DayUiModel = createDayUiModel(day);

        expect(result.isToday).toBe(false);
    });
});