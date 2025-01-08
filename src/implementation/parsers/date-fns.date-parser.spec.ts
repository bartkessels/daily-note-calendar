import { DateFnsDateParser } from 'src/implementation/parsers/date-fns.date-parser';

describe('DateFnsDateParser', () => {
    let parser: DateFnsDateParser;

    beforeEach(() => {
        parser = new DateFnsDateParser();
    });

    it('should correctly parse a date with a valid template', () => {
        const date = new Date(2023, 9, 2);
        const template = 'yyyy-MM-dd';
        const result = parser.parse(date, template);
        expect(result).toBe('2023-10-02');
    });

    it('should correctly parse a date with a valid template including the day', () => {
        const date = new Date(2023, 9, 2);
        const template = 'yyyy-MM-dd - EEEE';
        const result = parser.parse(date, template);
        expect(result).toBe('2023-10-02 - Monday');
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

    it('should correctly parse a valid date string with a valid template', () => {
        const dateString = '2023-10-02';
        const template = 'yyyy-MM-dd';
        const result = parser.parseString(dateString, template);
        expect(result).toEqual(new Date(2023, 9, 2));
    });

    it('should correctly parse a valid date string with a valid template including the day', () => {
        const dateString = '2023-10-02 - Monday';
        const template = 'yyyy-MM-dd - EEEE';
        const result = parser.parseString(dateString, template);
        expect(result).toEqual(new Date(2023, 9, 2));
    });

    it('should return null if the date string is invalid', () => {
        const dateString = 'invalid-date';
        const template = 'yyyy-MM-dd';
        const result = parser.parseString(dateString, template);
        expect(result).toBeNull();
    });

    it('should return null if the template is invalid', () => {
        const dateString = '2023-10-02';
        const template = 'invalid-template';
        const result = parser.parseString(dateString, template);
        expect(result).toBeNull();
    });
});