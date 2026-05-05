import {DateFnsDateParser} from 'src/infrastructure/parsers/date-fns.date-parser';

describe('DateFnsDateParser', () => {
    let parser: DateFnsDateParser;

    beforeEach(() => {
        parser = new DateFnsDateParser();
    });

    describe('fromDate', () => {
        it('should correctly return the string for a valid template', () => {
            // Arrange
            const date = new Date(2023, 9, 2);
            const template = 'yyyy-MM-dd';

            // Act
            const result = parser.fromDate(date, template);

            // Assert
            expect(result).toBe('2023-10-02');
        });

        it('should return the template if the template is invalid', () => {
            // Arrange
            const date = new Date(2023, 9, 2);
            const template = 'invalid-template';

            // Act
            const result = parser.fromDate(date, template);

            // Assert
            expect(result).toBe('invalid-template');
        });

        it('should return the template if the date is invalid', () => {
            // Arrange
            const date = new Date('invalid-date');
            const template = 'yyyy-MM-dd';

            // Act
            const result = parser.fromDate(date, template);

            // Assert
            expect(result).toBe('yyyy-MM-dd');
        });

        it('should produce week 2 for 2024-01-07 when weekStartsOn is Sunday (0)', () => {
            // Arrange — 2024-01-07 is a Sunday.
            // Under Sunday-start rules the week containing 2024-01-01 (Monday) starts on
            // Dec 31 2023 (Sunday) = week 1, so Jan 7 (the next Sunday) = week 2.
            // Under Monday-start rules Jan 1 is the Monday that opens week 1, and Jan 7
            // (still inside that Mon–Sun span) = week 1.  The two conventions diverge here.
            const date = new Date(2024, 0, 7);
            const template = 'w';

            // Act
            const result = parser.fromDate(date, template, { weekStartsOn: 0 });

            // Assert
            expect(result).toBe('2');
        });

        it('should produce week 1 for 2024-01-07 when weekStartsOn is Monday (1)', () => {
            // Arrange — same date as above; under Monday-start Jan 7 is still in week 1.
            const date = new Date(2024, 0, 7);
            const template = 'w';

            // Act
            const result = parser.fromDate(date, template, { weekStartsOn: 1 });

            // Assert
            expect(result).toBe('1');
        });
    });

    describe('fromString', () => {
        it('should correctly parse a date with a valid template', () => {
            // Arrange
            const expectedDate = new Date(2023, 9, 2);
            const date = '2023-10-02';
            const template = 'yyyy-MM-dd';

            // Act
            const result = parser.fromString(date, template);

            // Assert
            expect(result).toEqual(expectedDate);
        });

        it('should return null if the template is invalid', () => {
            // Arrange
            const date = '2023-10-02';
            const template = 'invalid-template';

            // Act
            const result = parser.fromString(date, template);

            // Assert
            expect(result).toBeNull();
        });

        it('should return null if the date is invalid', () => {
            // Arrange
            const date = 'invalid-date';
            const template = 'yyyy-MM-dd';

            // Act
            const result = parser.fromString(date, template);

            // Assert
            expect(result).toBeNull();
        });
    });
});