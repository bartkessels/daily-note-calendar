import { dayEquals, Day, DayOfWeek } from 'src/domain/models/day';

describe('dayEquals', () => {
    it('should return false if either day is undefined', () => {
        const dayA: Day | undefined = undefined;
        const dayB: Day = {
            date: new Date(2023, 0, 1),
            dayOfWeek: DayOfWeek.Monday,
            name: 'Monday',
        };

        expect(dayEquals(dayA, dayB)).toBe(false);
        expect(dayEquals(dayB, dayA)).toBe(false);
    });

    it('should return false if the dates are different', () => {
        const dayA: Day = {
            date: new Date(2023, 0, 1),
            dayOfWeek: DayOfWeek.Monday,
            name: 'Monday',
        };
        const dayB: Day = {
            date: new Date(2023, 0, 2),
            dayOfWeek: DayOfWeek.Tuesday,
            name: 'Tuesday',
        };

        expect(dayEquals(dayA, dayB)).toBe(false);
    });

    it('should return true if the dates are the same', () => {
        const dayA: Day = {
            date: new Date(2023, 0, 1),
            dayOfWeek: DayOfWeek.Monday,
            name: 'Monday',
        };
        const dayB: Day = {
            date: new Date(2023, 0, 1),
            dayOfWeek: DayOfWeek.Monday,
            name: 'Monday',
        };

        expect(dayEquals(dayA, dayB)).toBe(true);
    });
});
