import {RepositoryDateManager} from 'src/business/managers/repository.date-manager';
import {afterEach} from '@jest/globals';
import {Period, PeriodType} from 'src/domain/models/period.model';
import {when} from 'jest-when';
import {DayOfWeek, Week} from 'src/domain/models/week';
import {mockDateRepository} from 'src/test-helpers/repository.mocks';
import {mockDateRepositoryFactory} from 'src/test-helpers/factory.mocks';

describe('RepositoryDateManager', () => {
    let manager: RepositoryDateManager;

    const dateRepository = mockDateRepository;
    const today = new Date(2023, 9, 2);
    const year = <Period> {
        date: new Date(2023),
        name: '2023',
        type: PeriodType.Year
    };
    const quarter = <Period>{
        date: new Date(2023, 6),
        name: 'Q3',
        type: PeriodType.Quarter
    };
    const month = <Period>{
        date: new Date(2023, 9),
        name: 'October',
        type: PeriodType.Month
    };

    beforeEach(() => {
        jest.useFakeTimers();
        jest.setSystemTime(today);

        const dateRepositoryFactory = mockDateRepositoryFactory(dateRepository);

        manager = new RepositoryDateManager(dateRepositoryFactory);
    });

    afterEach(() => {
        jest.useRealTimers();
        jest.clearAllMocks();
    });

    describe('getCurrentDay', () => {
        it('should return the period with the date of today from the repository', () => {
            // Arrange
            const expected = <Period>{
                date: today,
                name: '2',
                type: PeriodType.Day
            };
            when(dateRepository.getDayFromDate).calledWith(today).mockReturnValue(expected);

            // Act
            const result = manager.getCurrentDay();

            // Assert
            expect(result).toBe(expected);
        });
    });

    describe('getTomorrow', () => {
        it('should return the period with the date of tomorrow from the repository', () => {
            // Arrange
            const tomorrow = new Date(2023, 9, 3);
            const expected = <Period>{
                date: tomorrow,
                name: '3',
                type: PeriodType.Day
            };
            when(dateRepository.getDayFromDate).calledWith(tomorrow).mockReturnValue(expected);

            // Act
            const result = manager.getTomorrow();

            // Assert
            expect(result).toBe(expected);
        });
    });

    describe('getYesterday', () => {
        it('should return the period with the date of yesterday from the repository', () => {
            // Arrange
            const yesterday = new Date(2023, 9, 1);
            const expected = <Period>{
                date: yesterday,
                name: '1',
                type: PeriodType.Day
            };
            when(dateRepository.getDayFromDate).calledWith(yesterday).mockReturnValue(expected);

            // Act
            const result = manager.getYesterday();

            // Assert
            expect(result).toBe(expected);
        });
    });

    describe('getCurrentWeek', () => {
        it('should return the week from the repository', () => {
            // Arrange
            const expected = <Week>{
                weekNumber: 40,
                year: year,
                month: month,
                quarter: quarter,
                date: today,
                name: '40',
                type: PeriodType.Week,
                days: []
            };
            when(dateRepository.getWeekFromDate).calledWith(DayOfWeek.Monday, today).mockReturnValue(expected);

            // Act
            const result = manager.getCurrentWeek(DayOfWeek.Monday);

            // Assert
            expect(result).toBe(expected);
        });
    });

    describe('getWeek', () => {
        it('should return the week from the repository', () => {
            // Arrange
            const period = <Period>{
                date: new Date(2023, 9, 2),
                name: '2',
                type: PeriodType.Day
            };
            const expected = <Week>{
                weekNumber: 40,
                year: year,
                quarter: quarter,
                month: month,
                date: period.date,
                name: '40',
                type: PeriodType.Week,
                days: []
            };
            when(dateRepository.getWeekFromDate).calledWith(DayOfWeek.Monday, period.date).mockReturnValue(expected);

            // Act
            const result = manager.getWeek(period, DayOfWeek.Monday);

            // Assert
            expect(result).toBe(expected);
        });
    });

    describe('getPreviousWeeks', () => {
        const currentWeek = <Week>{
            weekNumber: 40,
            year: year,
            quarter: quarter,
            month: month,
            date: new Date(2023, 9, 2),
            name: '40',
            type: PeriodType.Week,
            days: []
        };
        const previousWeeks = [
            <Week>{
                weekNumber: 38,
                year: year,
                quarter: quarter,
                month: month,
                date: new Date(2023, 8, 18),
                name: '38',
                type: PeriodType.Week,
                days: []
            },
            <Week>{
                weekNumber: 39,
                year: year,
                quarter: quarter,
                month: month,
                date: new Date(2023, 8, 25),
                name: '39',
                type: PeriodType.Week,
                days: []
            }
        ];

        it('should return the previous weeks from the repository', () => {
            // Arrange
            when(dateRepository.getPreviousWeek)
                .calledWith(DayOfWeek.Monday, currentWeek).mockReturnValue(previousWeeks[0])
                .calledWith(DayOfWeek.Monday, previousWeeks[0]).mockReturnValue(previousWeeks[1]);

            // Act
            const result = manager.getPreviousWeeks(DayOfWeek.Monday, currentWeek, 2);

            // Assert
            expect(result).toStrictEqual(previousWeeks);
        });

        it('should return the previous weeks from the repository sorted', () => {
            // Arrange
            when(dateRepository.getPreviousWeek)
                .calledWith(DayOfWeek.Monday, currentWeek)
                .mockReturnValue(previousWeeks[1])
                .calledWith(DayOfWeek.Monday, previousWeeks[1])
                .mockReturnValue(previousWeeks[0]);

            // Act
            const result = manager.getPreviousWeeks(DayOfWeek.Monday, currentWeek, 2);

            // Assert
            expect(result).toEqual(previousWeeks);
        });
    });

    describe('getNextWeeks', () => {
        const currentWeek = <Week>{
            weekNumber: 40,
            year: year,
            quarter: quarter,
            month: month,
            date: new Date(2023, 9, 2),
            name: '40',
            type: PeriodType.Week,
            days: []
        };
        const nextWeeks = [
            <Week>{
                weekNumber: 41,
                year: year,
                quarter: quarter,
                month: month,
                date: new Date(2023, 9, 9),
                name: '41',
                type: PeriodType.Week,
                days: []
            },
            <Week>{
                weekNumber: 42,
                year: year,
                quarter: quarter,
                month: month,
                date: new Date(2023, 9, 16),
                name: '42',
                type: PeriodType.Week,
                days: []
            }
        ];

        it('should return the next weeks from the repository', () => {
            // Arrange
            when(dateRepository.getNextWeek)
                .calledWith(DayOfWeek.Monday, currentWeek).mockReturnValue(nextWeeks[0])
                .calledWith(DayOfWeek.Monday, nextWeeks[0]).mockReturnValue(nextWeeks[1]);

            // Act
            const result = manager.getNextWeeks(DayOfWeek.Monday, currentWeek, 2);

            // Assert
            expect(result).toStrictEqual(nextWeeks);
        });

        it('should return the next weeks from the repository sorted', () => {
            // Arrange
            when(dateRepository.getNextWeek)
                .calledWith(DayOfWeek.Monday, currentWeek).mockReturnValue(nextWeeks[1])
                .calledWith(DayOfWeek.Monday, nextWeeks[1]).mockReturnValue(nextWeeks[0]);

            // Act
            const result = manager.getNextWeeks(DayOfWeek.Monday, currentWeek, 2);

            // Assert
            expect(result).toStrictEqual(nextWeeks);
        });
    });

    describe('getPreviousMonth', () => {
        const previousMonth = <Period>{
            date: new Date(2023, 8),
            name: 'September',
            type: PeriodType.Month
        };
        const weeksOfPreviousMonth: Week[] = [
            {
                date: new Date(2023, 7, 28),
                name: '39',
                weekNumber: 39,
                year: year,
                quarter: quarter,
                month: previousMonth,
                days: [],
                type: PeriodType.Week
            },
            {
                date: new Date(2023, 8, 4),
                name: '40',
                weekNumber: 40,
                year: year,
                quarter: quarter,
                month: previousMonth,
                days: [],
                type: PeriodType.Week
            },
            {
                date: new Date(2023, 8, 11),
                name: '41',
                weekNumber: 41,
                year: year,
                quarter: quarter,
                month: previousMonth,
                days: [],
                type: PeriodType.Week
            },
            {
                date: new Date(2023, 8, 18),
                name: '42',
                weekNumber: 42,
                year: year,
                quarter: quarter,
                month: previousMonth,
                days: [],
                type: PeriodType.Week
            },
            {
                date: new Date(2023, 8, 25),
                name: '43',
                weekNumber: 43,
                year: year,
                quarter: quarter,
                month: previousMonth,
                days: [],
                type: PeriodType.Week
            }
        ];

        it('should return call the getPreviousMonth with the given month on the repository and should call the correct getWeeksOfMonth method', () => {
            // Arrange
            when(dateRepository.getPreviousMonth).calledWith(month).mockReturnValue(previousMonth);
            when(dateRepository.getWeekFromDate).mockReturnValue(weeksOfPreviousMonth[2]);
            when(dateRepository.getPreviousWeek)
                .calledWith(DayOfWeek.Monday, weeksOfPreviousMonth[2])
                .mockReturnValue(weeksOfPreviousMonth[0])
                .calledWith(DayOfWeek.Monday, weeksOfPreviousMonth[0])
                .mockReturnValue(weeksOfPreviousMonth[1]);

            when(dateRepository.getNextWeek)
                .calledWith(DayOfWeek.Monday, weeksOfPreviousMonth[2])
                .mockReturnValue(weeksOfPreviousMonth[3])
                .calledWith(DayOfWeek.Monday, weeksOfPreviousMonth[3])
                .mockReturnValue(weeksOfPreviousMonth[4]);

            // Act
            const result = manager.getPreviousMonth(month, DayOfWeek.Monday);

            // Assert
            const weekFromDateCalls = dateRepository.getWeekFromDate.mock.calls;
            expect(weekFromDateCalls.some(call => call[1].getFullYear() === previousMonth.date.getFullYear())).toBeTruthy();
            expect(weekFromDateCalls.some(call => call[1].getMonth() === previousMonth.date.getMonth())).toBeTruthy();
            expect(dateRepository.getPreviousMonth).toHaveBeenCalledWith(month);
            expect(result).toEqual(weeksOfPreviousMonth);
        });

        it('should sort the weeks correctly', () => {
            // Arrange
            when(dateRepository.getPreviousMonth).calledWith(month).mockReturnValue(previousMonth);
            when(dateRepository.getWeekFromDate).mockReturnValue(weeksOfPreviousMonth[2]);
            when(dateRepository.getPreviousWeek)
                .calledWith(DayOfWeek.Monday, weeksOfPreviousMonth[2])
                .mockReturnValue(weeksOfPreviousMonth[1])
                .calledWith(DayOfWeek.Monday, weeksOfPreviousMonth[1])
                .mockReturnValue(weeksOfPreviousMonth[0]);

            when(dateRepository.getNextWeek)
                .calledWith(DayOfWeek.Monday, weeksOfPreviousMonth[2])
                .mockReturnValue(weeksOfPreviousMonth[4])
                .calledWith(DayOfWeek.Monday, weeksOfPreviousMonth[4])
                .mockReturnValue(weeksOfPreviousMonth[3]);

            // Act
            const result = manager.getPreviousMonth(month, DayOfWeek.Monday);

            // Assert
            const weekFromDateCalls = dateRepository.getWeekFromDate.mock.calls;
            expect(weekFromDateCalls.some(call => call[1].getFullYear() === previousMonth.date.getFullYear())).toBeTruthy();
            expect(weekFromDateCalls.some(call => call[1].getMonth() === previousMonth.date.getMonth())).toBeTruthy();
            expect(dateRepository.getPreviousMonth).toHaveBeenCalledWith(month);
            expect(result).toEqual(weeksOfPreviousMonth);
        });
    });

    describe('getNextMonth', () => {
        const nextMonth = <Period>{
            date: new Date(2023, 10),
            name: 'November',
            type: PeriodType.Month
        };
        const weeksOfNextMonth: Week[] = [
            {
                date: new Date(2023, 9, 30),
                name: '44',
                weekNumber: 44,
                year: year,
                quarter: quarter,
                month: month,
                days: [],
                type: PeriodType.Week
            },
            {
                date: new Date(2023, 10,4),
                name: '45',
                weekNumber: 45,
                year: year,
                quarter: quarter,
                month: nextMonth,
                days: [],
                type: PeriodType.Week
            },
            {
                date: new Date(2023, 10, 13),
                name: '46',
                weekNumber: 46,
                year: year,
                quarter: quarter,
                month: nextMonth,
                days: [],
                type: PeriodType.Week
            },
            {
                date: new Date(2023, 10, 20),
                name: '47',
                weekNumber: 47,
                year: year,
                quarter: quarter,
                month: nextMonth,
                days: [],
                type: PeriodType.Week
            },
            {
                date: new Date(2023, 10, 27),
                name: '48',
                weekNumber: 48,
                year: year,
                quarter: quarter,
                month: nextMonth,
                days: [],
                type: PeriodType.Week
            }
        ];

        it('should return call the getNextMonth with the given month on the repository and should call the correct getWeeksOfMonth method', () => {
            // Arrange
            when(dateRepository.getNextMonth).calledWith(month).mockReturnValue(nextMonth);
            when(dateRepository.getWeekFromDate).mockReturnValue(weeksOfNextMonth[2]);
            when(dateRepository.getPreviousWeek)
                .calledWith(DayOfWeek.Monday, weeksOfNextMonth[2])
                .mockReturnValue(weeksOfNextMonth[0])
                .calledWith(DayOfWeek.Monday, weeksOfNextMonth[0])
                .mockReturnValue(weeksOfNextMonth[1]);

            when(dateRepository.getNextWeek)
                .calledWith(DayOfWeek.Monday, weeksOfNextMonth[2])
                .mockReturnValue(weeksOfNextMonth[3])
                .calledWith(DayOfWeek.Monday, weeksOfNextMonth[3])
                .mockReturnValue(weeksOfNextMonth[4]);

            // Act
            const result = manager.getNextMonth(month, DayOfWeek.Monday);

            // Assert
            const weekFromDateCalls = dateRepository.getWeekFromDate.mock.calls;
            expect(weekFromDateCalls.some(call => call[1].getFullYear() === nextMonth.date.getFullYear())).toBeTruthy();
            expect(weekFromDateCalls.some(call => call[1].getMonth() === nextMonth.date.getMonth())).toBeTruthy();
            expect(dateRepository.getNextMonth).toHaveBeenCalledWith(month);
            expect(result).toEqual(weeksOfNextMonth);
        });

        it('should sort the weeks correctly', () => {
            // Arrange
            when(dateRepository.getNextMonth).calledWith(month).mockReturnValue(nextMonth);
            when(dateRepository.getWeekFromDate).mockReturnValue(weeksOfNextMonth[2]);
            when(dateRepository.getPreviousWeek)
                .calledWith(DayOfWeek.Monday, weeksOfNextMonth[2])
                .mockReturnValue(weeksOfNextMonth[1])
                .calledWith(DayOfWeek.Monday, weeksOfNextMonth[1])
                .mockReturnValue(weeksOfNextMonth[0]);

            when(dateRepository.getNextWeek)
                .calledWith(DayOfWeek.Monday, weeksOfNextMonth[2])
                .mockReturnValue(weeksOfNextMonth[4])
                .calledWith(DayOfWeek.Monday, weeksOfNextMonth[4])
                .mockReturnValue(weeksOfNextMonth[3]);

            // Act
            const result = manager.getNextMonth(month, DayOfWeek.Monday);

            // Assert
            const weekFromDateCalls = dateRepository.getWeekFromDate.mock.calls;
            expect(weekFromDateCalls.some(call => call[1].getFullYear() === nextMonth.date.getFullYear())).toBeTruthy();
            expect(weekFromDateCalls.some(call => call[1].getMonth() === nextMonth.date.getMonth())).toBeTruthy();
            expect(dateRepository.getNextMonth).toHaveBeenCalledWith(month);
            expect(result).toEqual(weeksOfNextMonth);
        });
    });

    describe('getQuarter', () => {
        it('should return the quarter from the repository', () => {
            // Arrange
            const month = <Period>{
                date: new Date(2023, 9),
                name: 'October',
                type: PeriodType.Month
            };
            const expected = <Period>{
                date: new Date(2023, 6),
                name: 'Q3',
                type: PeriodType.Quarter
            };
            when(dateRepository.getQuarter).calledWith(month).mockReturnValue(expected);

            // Act
            const result = manager.getQuarter(month);

            // Assert
            expect(result).toBe(expected);
        });
    });
});