import {PeriodNameBuilder} from 'src/business/builders/period.name-builder';
import {DateParser} from 'src/infrastructure/contracts/date-parser';
import {DateParserFactory} from 'src/infrastructure/contracts/date-parser-factory';
import {Period, PeriodType} from 'src/domain/models/period.model';
import {when} from 'jest-when';

describe('PeriodNameBuilder', () => {
    let nameBuilder: PeriodNameBuilder;
    let dateParser = {
        fromDate: jest.fn(),
    } as unknown as jest.Mocked<DateParser>;

    const nameTemplate = 'yyyy-MM-dd';
    const period = <Period> {
        date: new Date(2023, 9, 2),
        name: '2',
        type: PeriodType.Day
    };

    beforeEach(() => {
        const dateParserFactory = {
            getParser: jest.fn(() => dateParser)
        } as jest.Mocked<DateParserFactory>;

        nameBuilder = new PeriodNameBuilder(dateParserFactory);
    });

    describe('build', () => {
        it('should build a name with the provided template, value, and path', () => {
            // Arrange
            const path = '/daily-notes';

            when(dateParser.fromDate)
                .calledWith(period.date, path)
                .mockReturnValue(path)
                .calledWith(period.date, nameTemplate)
                .mockReturnValue('2023-10-02.md');

            // Act
            const result = nameBuilder.withPath(path).withName(nameTemplate).withValue(period).build();

            // Assert
            expect(dateParser.fromDate).toHaveBeenCalledWith(period.date, path);
            expect(dateParser.fromDate).toHaveBeenCalledWith(period.date, nameTemplate);
            expect(result).toBe('/daily-notes/2023-10-02.md');
        });

        it('should build a name without the path if it is not provided', () => {
            // Arrange
            when(dateParser.fromDate)
                .calledWith(period.date, '')
                .mockReturnValue('')
                .calledWith(period.date, nameTemplate)
                .mockReturnValue('2023-10-02.md');

            // Act
            const result = nameBuilder.withName(nameTemplate).withValue(period).build();

            // Assert
            expect(dateParser.fromDate).toHaveBeenCalledWith(period.date, '');
            expect(dateParser.fromDate).toHaveBeenCalledWith(period.date, nameTemplate);
            expect(result).toBe('2023-10-02.md');
        });

        it('should throw an error if the period is not provided', () => {
            // Act & Assert
            expect(() => nameBuilder.withName(nameTemplate).build())
                .toThrow("Period is required!");
        });

        it('should throw an error if the name template is not provided', () => {
            // Act & Assert
            expect(() => nameBuilder.withValue(period).build())
                .toThrow("Name template is required!");
        });
    });
});
