import {DateFnsDateRepository} from 'src/infrastructure/repositories/date-fns.date-repository';
import {mockDateParser} from 'src/test-helpers/parser.mocks';
import {mockDateParserFactory} from 'src/test-helpers/factory.mocks';
import {when} from 'jest-when';
import {Period, PeriodType} from 'src/domain/models/period.model';
import {DayOfWeek, WeekModel} from 'src/domain/models/week.model';

describe('DateFnsDateRepository', () => {
    let repository: DateFnsDateRepository;
    const dateParser = mockDateParser;

    beforeEach(() => {
        const dateParserFactory = mockDateParserFactory(dateParser);

        repository = new DateFnsDateRepository(dateParserFactory);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('getDayFromDate', () => {
        it('should return the name with a leading zero for a day less than 10', () => {
            // Arrange
            const date = new Date(2023, 9, 2);

            // Act
            const result = repository.getDayFromDate(date);

            // Assert
            expect(result).toEqual({
                name: '02',
                date: date,
                type: PeriodType.Day
            });
        });

        it('should return the name without a leading zero for a day greater than 9', () => {
            // Arrange
            const date = new Date(2023, 9, 10);

            // Act
            const result = repository.getDayFromDate(date);

            // Assert
            expect(result).toEqual({
                name: '10',
                date: date,
                type: PeriodType.Day
            });
        });
    });

    describe('getDayFromDateString', () => {
        it('should return the expected day period when the dateParser returns a valid date', () => {
            // Arrange
            const expectedDate = new Date(2023, 9, 2);
            const dateString = '2023-10-02';
            const dateTemplate = 'yyyy-MM-dd';

            when(dateParser.fromString).calledWith(dateString, dateTemplate).mockReturnValue(expectedDate);

            // Act
            const result = repository.getDayFromDateString(dateString, dateTemplate);

            // Assert
            expect(result).toEqual({
                name: '02',
                date: expectedDate,
                type: PeriodType.Day
            });
        });

        it('should return null if the dateParser returns null', () => {
            // Arrange
            const dateString = 'invalid';
            const dateTemplate = 'yyyy-MM-dd';

            when(dateParser.fromString).calledWith(dateString, dateTemplate).mockReturnValue(null);

            // Act
            const result = repository.getDayFromDateString(dateString, dateTemplate);

            // Assert
            expect(result).toBeNull();
        });
    });

    describe('getWeekFromDate', () => {
        it('should return the expected week period when the week starts on a monday', () => {
            // Arrange
            const tuesday = new Date(2023, 9, 3);
            const startOfWeek = DayOfWeek.Monday;

            // Act
            const result = repository.getWeekFromDate(startOfWeek, tuesday);

            // Assert
            expect(result).toEqual(<WeekModel> {
                date: new Date(2023, 9, 2),
                name: '40',
                weekNumber: 40,
                year: <Period> {
                    name: '2023',
                    date: new Date(2023, 0),
                    type: PeriodType.Year
                },
                quarter: {
                    name: 'Q4',
                    date: new Date(2023, 9),
                    type: PeriodType.Quarter
                },
                month: <Period> {
                    name: 'October',
                    date: new Date(2023, 9),
                    type: PeriodType.Month
                },
                days: expect.any(Array),
                type: PeriodType.Week
            });
        });

        it('should return the expected week period when the week starts on a sunday', () => {
            // Arrange
            const tuesday = new Date(2023, 9, 3);
            const startOfWeek = DayOfWeek.Sunday;

            // Act
            const result = repository.getWeekFromDate(startOfWeek, tuesday);

            // Assert
            expect(result).toEqual(<WeekModel> {
                date: new Date(2023, 9, 1),
                name: '39',
                weekNumber: 39,
                year: <Period> {
                    name: '2023',
                    date: new Date(2023, 0),
                    type: PeriodType.Year
                },
                quarter: {
                    name: 'Q4',
                    date: new Date(2023, 9),
                    type: PeriodType.Quarter
                },
                month: <Period> {
                    name: 'October',
                    date: new Date(2023, 9),
                    type: PeriodType.Month
                },
                days: expect.any(Array),
                type: PeriodType.Week
            });
        });

        it('should return the correct days for the week when the week starts on a sunday', () => {
            // Arrange
            const tuesday = new Date(2023, 9, 3);
            const startOfWeek = DayOfWeek.Sunday;

            // Act
            const result = repository.getWeekFromDate(startOfWeek, tuesday);

            // Assert
            expect(result.days.length).toBe(7);
            expect(result.days[0]).toEqual({
                name: '01',
                date: new Date(2023, 9, 1),
                type: PeriodType.Day
            });
            expect(result.days[1]).toEqual({
                name: '02',
                date: new Date(2023, 9, 2),
                type: PeriodType.Day
            });
            expect(result.days[2]).toEqual({
                name: '03',
                date: new Date(2023, 9, 3),
                type: PeriodType.Day
            });
            expect(result.days[3]).toEqual({
                name: '04',
                date: new Date(2023, 9, 4),
                type: PeriodType.Day
            });
            expect(result.days[4]).toEqual({
                name: '05',
                date: new Date(2023, 9, 5),
                type: PeriodType.Day
            });
            expect(result.days[5]).toEqual({
                name: '06',
                date: new Date(2023, 9, 6),
                type: PeriodType.Day
            });
            expect(result.days[6]).toEqual({
                name: '07',
                date: new Date(2023, 9, 7),
                type: PeriodType.Day
            });
        });

        it('should return the correct days for the week when the week starts on a monday', () => {
            // Arrange
            const tuesday = new Date(2023, 9, 3);
            const startOfWeek = DayOfWeek.Monday;

            // Act
            const result = repository.getWeekFromDate(startOfWeek, tuesday);

            // Assert
            expect(result.days.length).toBe(7);
            expect(result.days[0]).toEqual({
                name: '02',
                date: new Date(2023, 9, 2),
                type: PeriodType.Day
            });
            expect(result.days[1]).toEqual({
                name: '03',
                date: new Date(2023, 9, 3),
                type: PeriodType.Day
            });
            expect(result.days[2]).toEqual({
                name: '04',
                date: new Date(2023, 9, 4),
                type: PeriodType.Day
            });
            expect(result.days[3]).toEqual({
                name: '05',
                date: new Date(2023, 9, 5),
                type: PeriodType.Day
            });
            expect(result.days[4]).toEqual({
                name: '06',
                date: new Date(2023, 9, 6),
                type: PeriodType.Day
            });
            expect(result.days[5]).toEqual({
                name: '07',
                date: new Date(2023, 9, 7),
                type: PeriodType.Day
            });
            expect(result.days[6]).toEqual({
                name: '08',
                date: new Date(2023, 9, 8),
                type: PeriodType.Day
            });
        });
    });

    describe('getNextWeek', () => {
        it('should return the next week', () => {
            // Arrange
            const currentWeek = <WeekModel>{
                date: new Date(2023, 9, 3),
                name: '40',
                weekNumber: 40,
                year: <Period>{
                    name: '2023',
                    date: new Date(2023, 0),
                    type: PeriodType.Year
                },
                month: <Period>{
                    name: 'October',
                    date: new Date(2023, 9),
                    type: PeriodType.Month
                },
                days: expect.any(Array),
                type: PeriodType.Week
            };

            // Act
            const result = repository.getNextWeek(DayOfWeek.Monday, currentWeek);

            // Assert
            expect(result).toEqual(<WeekModel>{
                date: new Date(2023, 9, 9),
                name: '41',
                weekNumber: 41,
                year: <Period>{
                    name: '2023',
                    date: new Date(2023, 0),
                    type: PeriodType.Year
                },
                quarter: {
                    name: 'Q4',
                    date: new Date(2023, 9),
                    type: PeriodType.Quarter
                },
                month: <Period>{
                    name: 'October',
                    date: new Date(2023, 9),
                    type: PeriodType.Month
                },
                days: expect.any(Array),
                type: PeriodType.Week
            });
        });

        it('should return the next week when the current week is week 52 and the week starts on monday', () => {
            // Arrange
            const currentWeek = <WeekModel>{
                date: new Date(2023, 11, 31),
                name: '52',
                weekNumber: 52,
                year: <Period>{
                    name: '2023',
                    date: new Date(2023, 0),
                    type: PeriodType.Year
                },
                month: <Period>{
                    name: 'December',
                    date: new Date(2023, 11),
                    type: PeriodType.Month
                },
                days: expect.any(Array),
                type: PeriodType.Week
            };

            // Act
            const result = repository.getNextWeek(DayOfWeek.Monday, currentWeek);

            // Assert
            expect(result).toEqual(<WeekModel>{
                date: new Date(2024, 0, 1),
                name: '01',
                weekNumber: 1,
                year: <Period>{
                    name: '2024',
                    date: new Date(2024, 0),
                    type: PeriodType.Year
                },
                quarter: {
                    name: 'Q1',
                    date: new Date(2023, 12),
                    type: PeriodType.Quarter
                },
                month: <Period>{
                    name: 'January',
                    date: new Date(2024, 0),
                    type: PeriodType.Month
                },
                days: expect.any(Array),
                type: PeriodType.Week
            });
        });

        it('should return the next week when the current week is week 52 and the week starts on sunday', () => {
            // Arrange
            const currentWeek = <WeekModel>{
                date: new Date(2023, 11, 31),
                name: '52',
                weekNumber: 52,
                year: <Period>{
                    name: '2023',
                    date: new Date(2023, 0),
                    type: PeriodType.Year
                },
                month: <Period>{
                    name: 'December',
                    date: new Date(2023, 11),
                    type: PeriodType.Month
                },
                days: expect.any(Array),
                type: PeriodType.Week
            };

            // Act
            const result = repository.getNextWeek(DayOfWeek.Sunday, currentWeek);

            // Assert
            expect(result).toEqual(<WeekModel>{
                date: new Date(2024, 0, 7),
                name: '01',
                weekNumber: 1,
                year: <Period>{
                    name: '2024',
                    date: new Date(2024, 0),
                    type: PeriodType.Year
                },
                quarter: {
                    name: 'Q1',
                    date: new Date(2023, 12),
                    type: PeriodType.Quarter
                },
                month: <Period>{
                    name: 'January',
                    date: new Date(2024, 0),
                    type: PeriodType.Month
                },
                days: expect.any(Array),
                type: PeriodType.Week
            });
        });
    });

    describe('getPreviousWeek', () => {
        it('should return the previous week', () => {
            // Arrange
            const currentWeek = <WeekModel>{
                date: new Date(2023, 9, 3),
                name: '40',
                weekNumber: 40,
                year: <Period>{
                    name: '2023',
                    date: new Date(2023, 0),
                    type: PeriodType.Year
                },
                month: <Period>{
                    name: 'October',
                    date: new Date(2023, 9),
                    type: PeriodType.Month
                },
                days: expect.any(Array),
                type: PeriodType.Week
            };

            // Act
            const result = repository.getNextWeek(DayOfWeek.Monday, currentWeek);

            // Assert
            expect(result).toEqual(<WeekModel>{
                date: new Date(2023, 9, 9),
                name: '41',
                weekNumber: 41,
                year: <Period>{
                    name: '2023',
                    date: new Date(2023, 0),
                    type: PeriodType.Year
                },
                quarter: <Period>{
                    name: 'Q4',
                    date: new Date(2023, 9),
                    type: PeriodType.Quarter
                },
                month: <Period>{
                    name: 'October',
                    date: new Date(2023, 9),
                    type: PeriodType.Month
                },
                days: expect.any(Array),
                type: PeriodType.Week
            });
        });

        it('should return the previous week when the current week is week 1 and the week starts on monday', () => {
            // Arrange
            const currentWeek = <WeekModel>{
                date: new Date(2024, 0, 1),
                name: '01',
                weekNumber: 1,
                year: <Period>{
                    name: '2043',
                    date: new Date(2024, 0),
                    type: PeriodType.Year
                },
                month: <Period>{
                    name: 'January',
                    date: new Date(2024, 0),
                    type: PeriodType.Month
                },
                days: expect.any(Array),
                type: PeriodType.Week
            };

            // Act
            const result = repository.getPreviousWeek(DayOfWeek.Monday, currentWeek);

            // Assert
            expect(result).toEqual(<WeekModel>{
                date: new Date(2023, 11, 25),
                name: '52',
                weekNumber: 52,
                year: <Period>{
                    name: '2023',
                    date: new Date(2023, 0),
                    type: PeriodType.Year
                },
                quarter: <Period>{
                    name: 'Q4',
                    date: new Date(2023, 9),
                    type: PeriodType.Quarter
                },
                month: <Period>{
                    name: 'December',
                    date: new Date(2023, 11),
                    type: PeriodType.Month
                },
                days: expect.any(Array),
                type: PeriodType.Week
            });
        });

        it('should return the next week when the current week is week 52 and the week starts on sunday', () => {
            // Arrange
            const currentWeek = <WeekModel>{
                date: new Date(2024, 0, 1),
                name: '01',
                weekNumber: 1,
                year: <Period>{
                    name: '2043',
                    date: new Date(2024, 0),
                    type: PeriodType.Year
                },
                month: <Period>{
                    name: 'January',
                    date: new Date(2024, 0),
                    type: PeriodType.Month
                },
                days: expect.any(Array),
                type: PeriodType.Week
            };

            // Act
            const result = repository.getPreviousWeek(DayOfWeek.Sunday, currentWeek);

            // Assert
            expect(result).toEqual(<WeekModel>{
                date: new Date(2023, 11, 24),
                name: '51',
                weekNumber: 51,
                year: <Period>{
                    name: '2023',
                    date: new Date(2023, 0),
                    type: PeriodType.Year
                },
                quarter: <Period>{
                    name: 'Q4',
                    date: new Date(2023, 9),
                    type: PeriodType.Quarter
                },
                month: <Period>{
                    name: 'December',
                    date: new Date(2023, 11),
                    type: PeriodType.Month
                },
                days: expect.any(Array),
                type: PeriodType.Week
            });
        });
    });

    describe('getMonthFromDate', () => {
        it('should return the expected month period', () => {
            // Arrange
            const date = new Date(2023, 9, 2);

            // Act
            const result = repository.getMonthFromDate(date);

            // Assert
            expect(result).toEqual({
                name: 'October',
                date: new Date(2023, 9),
                type: PeriodType.Month
            });
        });
    });

    describe('getNextMonth', () => {
        it('should return the next month', () => {
            // Arrange
            const month = <Period>{
                name: 'October',
                date: new Date(2023, 9),
                type: PeriodType.Month
            };

            // Act
            const result = repository.getNextMonth(month);

            // Assert
            expect(result).toEqual(<Period>{
                name: 'November',
                date: new Date(2023, 10),
                type: PeriodType.Month
            });
        });

        it('should return the next month when the current month is december', () => {
            // Arrange
            const month = <Period>{
                name: 'December',
                date: new Date(2023, 11),
                type: PeriodType.Month
            };

            // Act
            const result = repository.getNextMonth(month);

            // Assert
            expect(result).toEqual(<Period>{
                name: 'January',
                date: new Date(2024, 0),
                type: PeriodType.Month
            });
        });
    });

    describe('getPreviousMonth', () => {
        it('should return the previous month', () => {
            // Arrange
            const month = <Period>{
                name: 'October',
                date: new Date(2023, 9),
                type: PeriodType.Month
            };

            // Act
            const result = repository.getPreviousMonth(month);

            // Assert
            expect(result).toEqual(<Period>{
                name: 'September',
                date: new Date(2023, 8),
                type: PeriodType.Month
            });
        });

        it('should return the previous month when the current month is january', () => {
            // Arrange
            const month = <Period>{
                name: 'January',
                date: new Date(2024, 0),
                type: PeriodType.Month
            };

            // Act
            const result = repository.getPreviousMonth(month);

            // Assert
            expect(result).toEqual(<Period>{
                name: 'December',
                date: new Date(2023, 11),
                type: PeriodType.Month
            });
        });
    });

    describe('getWeeksForMonth', () => {
        it('should return all weeks for the month', () => {

        });
    });

    describe('getQuarter', () => {
        it('should return the correct quarter for the month', () => {
            // Arrange
            const month = <Period>{
                name: 'November',
                date: new Date(2023, 10),
                type: PeriodType.Month
            };

            // Act
            const result = repository.getQuarter(month);

            // Assert
            expect(result).toEqual(<Period>{
                name: 'Q4',
                date: new Date(2023, 9),
                type: PeriodType.Quarter
            });
        });
    });
});