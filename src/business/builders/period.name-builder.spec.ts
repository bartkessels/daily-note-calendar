import {PeriodNameBuilder} from 'src/business/builders/period.name-builder';
import {when} from 'jest-when';
import {mockDateParser} from 'src/test-helpers/parser.mocks';
import {mockDateParserFactory} from 'src/test-helpers/factory.mocks';
import {mockPeriod} from 'src/test-helpers/model.mocks';

describe('PeriodNameBuilder', () => {
    let nameBuilder: PeriodNameBuilder;
    let dateParser = mockDateParser;

    const nameTemplate = 'yyyy-MM-dd';
    const period = mockPeriod;

    beforeEach(() => {
        const dateParserFactory = mockDateParserFactory(dateParser);

        nameBuilder = new PeriodNameBuilder(dateParserFactory);
    });

    describe('build', () => {
        it('should build a name with the provided template, value, and path', () => {
            // Arrange
            const path = '/daily-notes';

            when(dateParser.fromDate)
                .calledWith(period.date, nameTemplate)
                .mockReturnValue('2023-10-02.md');

            // Act
            const result = nameBuilder.withPath(path).withName(nameTemplate).withValue(period).build();

            // Assert
            expect(dateParser.fromDate).toHaveBeenCalledWith(period.date, nameTemplate);
            expect(result).toBe('/daily-notes/2023-10-02.md');
        });

        it('should not parse the path through date parser to avoid mangling literal folder names', () => {
            // Arrange - folder name contains characters that look like date-fns format tokens
            const path = 'Periodic/daily/notes';

            when(dateParser.fromDate)
                .calledWith(period.date, nameTemplate)
                .mockReturnValue('2023-10-02.md');

            // Act
            const result = nameBuilder.withPath(path).withName(nameTemplate).withValue(period).build();

            // Assert - path should be preserved literally, not parsed
            expect(result).toBe('Periodic/daily/notes/2023-10-02.md');
        });

        it('should build a name without the path if it is not provided', () => {
            // Arrange
            when(dateParser.fromDate)
                .calledWith(period.date, nameTemplate)
                .mockReturnValue('2023-10-02.md');

            // Act
            const result = nameBuilder.withName(nameTemplate).withValue(period).build();

            // Assert
            expect(dateParser.fromDate).toHaveBeenCalledWith(period.date, nameTemplate);
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
    });
});
