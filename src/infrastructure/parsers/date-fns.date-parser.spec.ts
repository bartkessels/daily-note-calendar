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