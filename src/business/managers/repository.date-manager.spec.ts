import {RepositoryDateManager} from 'src/business/managers/repository.date-manager';
import {DateRepository} from 'src/infrastructure/contracts/date-repository';
import {afterEach} from '@jest/globals';
import {DateRepositoryFactory} from 'src/infrastructure/contracts/date-repository-factory';
import {Period, PeriodType} from 'src/domain/models/period.model';
import {when} from 'jest-when';
import {DayOfWeek, WeekModel} from 'src/domain/models/week.model';

describe('RepositoryDateManager', () => {
    let manager: RepositoryDateManager;

    const dateRepository = {
        getDayFromDate: jest.fn(),
        getDayFromDateString: jest.fn(),
        getWeekFromDate: jest.fn(),
        getWeek: jest.fn(),
        getPreviousWeek: jest.fn(),
        getNextWeek: jest.fn(),
        getQuarter: jest.fn()
    } as jest.Mocked<DateRepository>;
    const today = new Date(2023, 9, 2);

    beforeEach(() => {
        jest.useFakeTimers();
        jest.setSystemTime(today);

        const dateRepositoryFactory = {
            getRepository: jest.fn(() => dateRepository)
        } as jest.Mocked<DateRepositoryFactory>;

        manager = new RepositoryDateManager(dateRepositoryFactory);
    });

    afterEach(() => {
        jest.useRealTimers();
        jest.clearAllMocks();
    });

    describe('getCurrentDay', () => {
        it('should return the period with the date of today from the repository', () => {
            // Arrange
            const expected = <Period> {
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
            const expected = <Period> {
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
            const expected = <Period> {
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
            const expected = <WeekModel> {
                weekNumber: 40,
                year: <Period> {
                    date: new Date(2023, 0),
                    name: '2023',
                    type: PeriodType.Year
                },
                month: <Period> {
                    date: new Date(2023, 9),
                    name: 'October',
                    type: PeriodType.Month
                },
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
            const period = <Period> {
                date: new Date(2023, 9, 2),
                name: '2',
                type: PeriodType.Day
            };
            const expected = <WeekModel> {
                weekNumber: 40,
                year: <Period> {
                    date: new Date(2023, 0),
                    name: '2023',
                    type: PeriodType.Year
                },
                month: <Period> {
                    date: new Date(2023, 9),
                    name: 'October',
                    type: PeriodType.Month
                },
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
        it('should return the previous weeks from the repository', () => {
            // Arrange
            const currentWeek = <WeekModel> {
                weekNumber: 40,
                year: <Period> {
                    date: new Date(2023, 0),
                    name: '2023',
                    type: PeriodType.Year
                },
                month: <Period> {
                    date: new Date(2023, 9),
                    name: 'October',
                    type: PeriodType.Month
                },
                date: today,
                name: '40',
                type: PeriodType.Week,
                days: []
            };
            const expected = [
                <WeekModel> {
                    weekNumber: 38,
                    year: <Period> {
                        date: new Date(2023, 0),
                        name: '2023',
                        type: PeriodType.Year
                    },
                    month: <Period> {
                        date: new Date(2023, 9),
                        name: 'October',
                        type: PeriodType.Month
                    },
                    date: today,
                    name: '38',
                    type: PeriodType.Week,
                    days: []
                },
                <WeekModel> {
                    weekNumber: 39,
                    year: <Period> {
                        date: new Date(2023, 0),
                        name: '2023',
                        type: PeriodType.Year
                    },
                    month: <Period> {
                        date: new Date(2023, 9),
                        name: 'October',
                        type: PeriodType.Month
                    },
                    date: today,
                    name: '39',
                    type: PeriodType.Week,
                    days: []
                }
            ];
            when(dateRepository.getPreviousWeek)
                .calledWith(DayOfWeek.Monday, currentWeek).mockReturnValue(expected[0])
                .calledWith(DayOfWeek.Monday, expected[0]).mockReturnValue(expected[1]);

            // Act
            const result = manager.getPreviousWeeks(DayOfWeek.Monday, currentWeek, 2);

            // Assert
            expect(result).toStrictEqual(expected);
        });
    });

    describe('getNextWeeks', () => {
        it('should return the next weeks from the repository', () => {
            // Arrange
            const currentWeek = <WeekModel> {
                weekNumber: 40,
                year: <Period> {
                    date: new Date(2023, 0),
                    name: '2023',
                    type: PeriodType.Year
                },
                month: <Period> {
                    date: new Date(2023, 9),
                    name: 'October',
                    type: PeriodType.Month
                },
                date: today,
                name: '40',
                type: PeriodType.Week,
                days: []
            };
            const expected = [
                <WeekModel> {
                    weekNumber: 41,
                    year: <Period> {
                        date: new Date(2023, 0),
                        name: '2023',
                        type: PeriodType.Year
                    },
                    month: <Period> {
                        date: new Date(2023, 9),
                        name: 'October',
                        type: PeriodType.Month
                    },
                    date: today,
                    name: '41',
                    type: PeriodType.Week,
                    days: []
                },
                <WeekModel> {
                    weekNumber: 42,
                    year: <Period> {
                        date: new Date(2023, 0),
                        name: '2023',
                        type: PeriodType.Year
                    },
                    month: <Period> {
                        date: new Date(2023, 9),
                        name: 'October',
                        type: PeriodType.Month
                    },
                    date: today,
                    name: '42',
                    type: PeriodType.Week,
                    days: []
                }
            ];
            when(dateRepository.getNextWeek)
                .calledWith(DayOfWeek.Monday, currentWeek).mockReturnValue(expected[0])
                .calledWith(DayOfWeek.Monday, expected[0]).mockReturnValue(expected[1]);

            // Act
            const result = manager.getNextWeeks(DayOfWeek.Monday, currentWeek, 2);

            // Assert
            expect(result).toStrictEqual(expected);
        });
    });

    describe('getQuarter', () => {
        it('should return the quarter from the repository', () => {
            // Arrange
            const month = <Period> {
                date: new Date(2023, 9),
                name: 'October',
                type: PeriodType.Month
            };
            const expected = <Period> {
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