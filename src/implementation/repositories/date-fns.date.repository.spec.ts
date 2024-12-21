import { DateFnsDateRepository } from 'src/implementation/repositories/date-fns.date.repository';
import { DayOfWeek } from 'src/domain/models/day';

describe('DateFnsDateRepository', () => {
    let repository: DateFnsDateRepository;

    beforeEach(() => {
        repository = new DateFnsDateRepository();
    });

    it('should return the correct day', () => {
        const date = new Date(2023, 9, 1);
        const day = repository.getDay(date);

        expect(day.name).toBe('1');
        expect(day.dayOfWeek).toBe(DayOfWeek.Sunday);
        expect(day.date).toEqual(date);
    });

    it('should return the correct year information', () => {
        const year = 2023;
        const result = repository.getYear(year);

        expect(result.date.getFullYear()).toBe(year);
        expect(result.name).toBe('2023');
        expect(result.months.length).toBe(12);
    });

    it('should return the correct month information', () => {
        const year = 2023;
        const monthIndex = 9;
        const month = repository.getMonth(year, monthIndex);

        expect(month.name).toBe('October');
        expect(month.weeks.length).toBeGreaterThan(0);
        expect(month.quarter).toBe(4);
    });

    it('should return the correct week number', () => {
        const year = 2023;
        const month = 9;
        const weekNumber = repository.getMonth(year, month).weeks[0].weekNumber;

        expect(weekNumber).toBe('39');
    });

    it('should return week number 1 for the last week of December 2024', () => {
        const year = 2024;
        const month = 11;
        const weeks = repository.getMonth(year, month).weeks;
        const lastWeek = weeks[weeks.length - 1];

        expect(lastWeek.weekNumber).toBe('01');
    });

    it('should return week number 1 for the first week of January 2025', () => {
        const year = 2025;
        const month = 0;
        const weeks = repository.getMonth(year, month).weeks;
        const firstWeek = weeks[0];

        expect(firstWeek.weekNumber).toBe('01');
    });

    it('should return the number of the week with 0s padded', () => {
        const year = 2024;
        const month = 0;
        const week = repository.getMonth(year, month).weeks[0];

        expect(week.weekNumber).toBe('01');
    })

    it('should return the correct day of the week', () => {
        const year = 2023;
        const month = 9;
        const dayOfWeek = repository.getMonth(year, month).weeks[0].days[0].dayOfWeek;

        expect(dayOfWeek).toBe(DayOfWeek.Sunday);
    });

    it('should return the correct quarter for each month', () => {
        const year = 2023;
        const months = [];

        for (let monthIndex = 0; monthIndex < 12; monthIndex++) {
            months.push(repository.getMonth(year, monthIndex));
        }

        // First quarter
        for (let index = 0; index <= 2; index++) {
            expect(months[index].quarter).toBe(1);
        }

        // Second quarter
        for (let index = 3; index <= 5; index++) {
            expect(months[index].quarter).toBe(2);
        }

        // Third quarter
        for (let index = 6; index <= 8; index++) {
            expect(months[index].quarter).toBe(3);
        }

        // Fourth quarter
        for (let index = 9; index <= 11; index++) {
            expect(months[index].quarter).toBe(4);
        }
    });
});