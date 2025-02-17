import {DateFnsDateRepository} from 'src/infrastructure/repositories/date-fns.date-repository';
import {mockDateParser} from 'src/test-helpers/parser.mocks';
import {mockDateParserFactory} from 'src/test-helpers/factory.mocks';
import {when} from 'jest-when';
import {PeriodType} from 'src/domain/models/period.model';

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

    });
});