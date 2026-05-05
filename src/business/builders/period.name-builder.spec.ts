import {PeriodNameBuilder} from 'src/business/builders/period.name-builder';
import {when} from 'jest-when';
import {mockDateParser} from 'src/test-helpers/parser.mocks';
import {mockDateParserFactory} from 'src/test-helpers/factory.mocks';
import {mockPeriod} from 'src/test-helpers/model.mocks';
import {DayOfWeek} from 'src/domain/models/week';
import {DateFnsDateParser} from 'src/infrastructure/parsers/date-fns.date-parser';

describe('PeriodNameBuilder', () => {
    let nameBuilder: PeriodNameBuilder;
    let dateParser: typeof mockDateParser;

    const nameTemplate = 'yyyy-MM-dd';
    const period = mockPeriod;

    beforeEach(() => {
        dateParser = mockDateParser;
        const dateParserFactory = mockDateParserFactory(dateParser);

        nameBuilder = new PeriodNameBuilder(dateParserFactory);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('build', () => {
        it('should build a name with the provided template, value, and path', () => {
            // Arrange
            const path = '/daily-notes';
            const options = { weekStartsOn: undefined };

            when(dateParser.fromDate)
                .calledWith(period.date, path, options)
                .mockReturnValue(path)
                .calledWith(period.date, nameTemplate, options)
                .mockReturnValue('2023-10-02.md');

            // Act
            const result = nameBuilder.withPath(path).withName(nameTemplate).withValue(period).build();

            // Assert
            expect(dateParser.fromDate).toHaveBeenCalledWith(period.date, path, options);
            expect(dateParser.fromDate).toHaveBeenCalledWith(period.date, nameTemplate, options);
            expect(result).toBe('/daily-notes/2023-10-02.md');
        });

        it('should build a name without the path if it is not provided', () => {
            // Arrange
            const options = { weekStartsOn: undefined };

            when(dateParser.fromDate)
                .calledWith(period.date, '', options)
                .mockReturnValue('')
                .calledWith(period.date, nameTemplate, options)
                .mockReturnValue('2023-10-02.md');

            // Act
            const result = nameBuilder.withName(nameTemplate).withValue(period).build();

            // Assert
            expect(dateParser.fromDate).toHaveBeenCalledWith(period.date, '', options);
            expect(dateParser.fromDate).toHaveBeenCalledWith(period.date, nameTemplate, options);
            expect(result).toBe('2023-10-02.md');
        });

        it('should throw an error if the period is not provided', () => {
            // Act
            const result = () => nameBuilder.withName(nameTemplate).build();

            // Assert
            expect(() => result()).toThrow('Could not create the note name: Period is required!');
        });

        it('should throw an error if the name template is not provided', () => {
            // Act
            const result = () => nameBuilder.withValue(period).build();

            // Assert
            expect(() => result()).toThrow('Could not create the note name: Name template is required!');
        });

        it('should produce week 2 for 2024-01-07 when withWeekStartsOn(Sunday) is used', () => {
            // Arrange — 2024-01-07 is a Sunday.
            // Under Sunday-start week rules it falls in week 2; under Monday-start it falls in week 1.
            // This test uses the real DateFnsDateParser to verify the fix is wired end-to-end.
            const realParser = new DateFnsDateParser();
            const realParserFactory = { getParser: () => realParser };
            const realBuilder = new PeriodNameBuilder(realParserFactory);
            const weekPeriod = { ...period, date: new Date(2024, 0, 7) };

            // Act
            const result = realBuilder
                .withName("'week' w")
                .withValue(weekPeriod)
                .withWeekStartsOn(DayOfWeek.Sunday)
                .build();

            // Assert — week 2 under Sunday-start, not week 1 (which Monday-start would produce)
            expect(result).toBe('week 2.md');
        });
    });
});
