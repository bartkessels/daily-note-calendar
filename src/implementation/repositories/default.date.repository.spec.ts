import {DefaultDateRepository} from 'src/implementation/repositories/default.date.repository';
import {DayOfWeek} from 'src/domain/models/day';
import 'src/extensions/extensions';

describe('DefaultDateRepository', () => {
    let repository: DefaultDateRepository;

    beforeEach(() => {
        repository = new DefaultDateRepository();
    });

    it('should return the correct day data', () => {
        const date = new Date(2023, 9, 1);
        const result = repository.getDay(date);

        expect(result.dayOfWeek).toBe(DayOfWeek.Sunday);
        expect(result.date).toBe(1);
        expect(result.name).toBe('1');
        expect(result.completeDate).toBe(date);
    });

    it('should return the correct month data', () => {
        const year = 2023;
        const month = 9;
        const result = repository.getMonth(year, month);

        expect(result.year).toBe(year);
        expect(result.monthIndex).toBe(month);
        expect(result.name).toBe('October');
        expect(result.weeks.length).toBeGreaterThan(0);
    });

    it('should return the correct days of the month', () => {
        const year = 2023;
        const month = 9; // October (0-based index)
        const days = repository.getMonth(year, month).weeks.flatMap(week => week.days);

        expect(days.length).toBe(31);
        expect(days[0].date).toBe(1);
        expect(days[30].date).toBe(31);
    });

    it('should group days into weeks correctly', () => {
        const year = 2023;
        const month = 9; // October (0-based index)

        const expectedWeeks = [
            {
                weekNumber: 39,
                days: [
                    { dayOfWeek: DayOfWeek.Sunday, name: '1', date: 1, completeDate: new Date(year, month, 1) }
                ]
            },
            {
                weekNumber: 40,
                days: [
                    { dayOfWeek: DayOfWeek.Monday, name: '2', date: 2, completeDate: new Date(year, month, 2) },
                    { dayOfWeek: DayOfWeek.Tuesday, name: '3', date: 3, completeDate: new Date(year, month, 3) },
                    { dayOfWeek: DayOfWeek.Wednesday, name: '4', date: 4, completeDate: new Date(year, month, 4) },
                    { dayOfWeek: DayOfWeek.Thursday, name: '5', date: 5, completeDate: new Date(year, month, 5) },
                    { dayOfWeek: DayOfWeek.Friday, name: '6', date: 6, completeDate: new Date(year, month, 6) },
                    { dayOfWeek: DayOfWeek.Saturday, name: '7', date: 7, completeDate: new Date(year, month, 7) },
                    { dayOfWeek: DayOfWeek.Sunday, name: '8', date: 8, completeDate: new Date(year, month, 8) },
                ]
            },
            {
                weekNumber: 41,
                days: [
                    { dayOfWeek: DayOfWeek.Monday, name: '9', date: 9, completeDate: new Date(year, month, 9) },
                    { dayOfWeek: DayOfWeek.Tuesday, name: '10', date: 10, completeDate: new Date(year, month, 10) },
                    { dayOfWeek: DayOfWeek.Wednesday, name: '11', date: 11, completeDate: new Date(year, month, 11) },
                    { dayOfWeek: DayOfWeek.Thursday, name: '12', date: 12, completeDate: new Date(year, month, 12) },
                    { dayOfWeek: DayOfWeek.Friday, name: '13', date: 13, completeDate: new Date(year, month, 13) },
                    { dayOfWeek: DayOfWeek.Saturday, name: '14', date: 14, completeDate: new Date(year, month, 14) },
                    { dayOfWeek: DayOfWeek.Sunday, name: '15', date: 15, completeDate: new Date(year, month, 15) }
                ]
            },
            {
                weekNumber: 42,
                days: [
                    { dayOfWeek: DayOfWeek.Monday, name: '16', date: 16, completeDate: new Date(year, month, 16) },
                    { dayOfWeek: DayOfWeek.Tuesday, name: '17', date: 17, completeDate: new Date(year, month, 17) },
                    { dayOfWeek: DayOfWeek.Wednesday, name: '18', date: 18, completeDate: new Date(year, month, 18) },
                    { dayOfWeek: DayOfWeek.Thursday, name: '19', date: 19, completeDate: new Date(year, month, 19) },
                    { dayOfWeek: DayOfWeek.Friday, name: '20', date: 20, completeDate: new Date(year, month, 20) },
                    { dayOfWeek: DayOfWeek.Saturday, name: '21', date: 21, completeDate: new Date(year, month, 21) },
                    { dayOfWeek: DayOfWeek.Sunday, name: '22', date: 22, completeDate: new Date(year, month, 22) }
                ]
            },
            {
                weekNumber: 43,
                days: [
                    { dayOfWeek: DayOfWeek.Monday, name: '23', date: 23, completeDate: new Date(year, month, 23) },
                    { dayOfWeek: DayOfWeek.Tuesday, name: '24', date: 24, completeDate: new Date(year, month, 24) },
                    { dayOfWeek: DayOfWeek.Wednesday, name: '25', date: 25, completeDate: new Date(year, month, 25) },
                    { dayOfWeek: DayOfWeek.Thursday, name: '26', date: 26, completeDate: new Date(year, month, 26) },
                    { dayOfWeek: DayOfWeek.Friday, name: '27', date: 27, completeDate: new Date(year, month, 27) },
                    { dayOfWeek: DayOfWeek.Saturday, name: '28', date: 28, completeDate: new Date(year, month, 28) },
                    { dayOfWeek: DayOfWeek.Sunday, name: '29', date: 29, completeDate: new Date(year, month, 29) }
                ]
            },
            {
                weekNumber: 44,
                days: [
                    { dayOfWeek: DayOfWeek.Monday, name: '30', date: 30, completeDate: new Date(year, month, 30) },
                    { dayOfWeek: DayOfWeek.Tuesday, name: '31', date: 31, completeDate: new Date(year, month, 31) }
                ]
            }
        ];

        const weeks = repository.getMonth(year, month).weeks;

        expect(weeks).toEqual(expectedWeeks);
    });

    it('should return the correct week number', () => {
        const year = 2023;
        const month = 9; // October (0-based index)

        const weekNumber = repository.getMonth(year, month).weeks[0].weekNumber;

        expect(weekNumber).toBe(39);
    });

    it('should return the correct day of the week', () => {
        const year = 2023;
        const month = 9; // October (0-based index)

        const dayOfWeek = repository.getMonth(year, month).weeks[0].days[0].dayOfWeek;

        expect(dayOfWeek).toBe(DayOfWeek.Sunday);
    });

    it('should return the correct year information', () => {
        const year = 2023;
        const result = repository.getYear(year);

        expect(result.year).toBe(year);
        expect(result.name).toBe('2023');
        expect(result.months.length).toBe(12);
    });

    it('should return the correct quarter for the each month', () => {
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