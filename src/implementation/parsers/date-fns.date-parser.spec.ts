import { DateFnsDateParser } from 'src/implementation/parsers/date-fns.date-parser';

describe('DateFnsDateParser', () => {
    let parser: DateFnsDateParser;

    beforeEach(() => {
        parser = new DateFnsDateParser();
    });

    it('should correctly parse a date with a valid template', () => {
        const date = new Date(2023, 9, 2); // October 2, 2023
        const template = 'yyyy-MM-dd';
        const result = parser.parse(date, template);
        expect(result).toBe('2023-10-02');
    });

    it('should return the template if the template is invalid', () => {
        const date = new Date(2023, 9, 2); // October 2, 2023
        const template = 'invalid-template';
        const result = parser.parse(date, template);
        expect(result).toBe('invalid-template');
    });

    it('should return the template if the date is invalid', () => {
        const date = new Date('invalid-date');
        const template = 'yyyy-MM-dd';
        const result = parser.parse(date, template);
        expect(result).toBe('yyyy-MM-dd');
    });
});