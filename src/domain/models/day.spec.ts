import { dayEquals, Day, DayOfWeek } from 'src/domain/models/day';

describe('dayEquals', () => {
    it('should return false if either day is undefined', () => {
        const dayA: Day | undefined = undefined;
        const dayB: Day | undefined = {
            dayOfWeek: DayOfWeek.Monday,
            date: 1,
            name: 'Monday',
            completeDate: new Date(2023, 0, 1)
        };

        expect(dayEquals(dayA, dayB)).toBe(false);
        expect(dayEquals(dayB, dayA)).toBe(false);
    });

    it('should return false if the dates are different', () => {
        const dayA: Day = {
            dayOfWeek: DayOfWeek.Monday,
            date: 1,
            name: 'Monday',
            completeDate: new Date(2023, 0, 1)
        };
        const dayB: Day = {
            dayOfWeek: DayOfWeek.Tuesday,
            date: 2,
            name: 'Tuesday',
            completeDate: new Date(2023, 0, 2)
        };

        expect(dayEquals(dayA, dayB)).toBe(false);
    });

    it('should return true if the dates are the same', () => {
        const dayA: Day = {
            dayOfWeek: DayOfWeek.Monday,
            date: 1,
            name: 'Monday',
            completeDate: new Date(2023, 0, 1)
        };
        const dayB: Day = {
            dayOfWeek: DayOfWeek.Monday,
            date: 1,
            name: 'Monday',
            completeDate: new Date(2023, 0, 1)
        };

        expect(dayEquals(dayA, dayB)).toBe(true);
    });
});