import { MonthNameBuilder } from 'src/implementation/builders/month.name-builder';
import { Month } from 'src/domain/models/Month';
import { Week } from 'src/domain/models/Week';
import {Day, DayOfWeek} from 'src/domain/models/Day';
import { join } from 'path';

describe('MonthNameBuilder', () => {
    let builder: MonthNameBuilder;
    const day: Day = {
        dayOfWeek: DayOfWeek.Tuesday,
        date: 12,
        name: '12',
        completeDate: new Date('2024-11-12')
    };
    const week: Week = {
        weekNumber: 46,
        days: [day]
    };
    const month: Month = {
        monthIndex: 11,
        year: 2024,
        name: 'November',
        number: 12,
        weeks: [week]
    };

    beforeEach(() => {
        builder = new MonthNameBuilder();
    });

    it('should throw an error if template is not provided', () => {
        builder.withValue(month).withPath('/path/to/monthly/notes');

        expect(() => builder.build()).toThrow('The template is not allowed to be null');
    });

    it('should throw an error if value is not provided', () => {
        builder.withNameTemplate('yyyy-MM').withPath('/path/to/monthly/notes');

        expect(() => builder.build()).toThrow('The month is not allowed to be null');
    });

    it('should throw an error if path is not provided', () => {
        builder.withNameTemplate('yyyy-MM').withValue(month);

        expect(() => builder.build()).toThrow('The paths is not allowed to be null');
    });

    it('should throw an error if month has no weeks', () => {

        builder.withNameTemplate('yyyy-MM').withValue(month).withPath('/path/to/monthly/notes');

        expect(() => builder.build()).toThrow('The month must have weeks defined');
    });

    it('should throw an error if month has weeks with no days', () => {
        const month: Month = { weeks: [{ days: [] }] };
        builder.withNameTemplate('yyyy-MM').withValue(month).withPath('/path/to/monthly/notes');

        expect(() => builder.build()).toThrow('The month must have days defined');
    });

    it('should build the correct file path with default template', () => {
        const day: Day = { completeDate: new Date('2023-10-01') };
        const week: Week = { days: [day] };
        const month: Month = { weeks: [week] };
        const expectedPath = join('/path/to/monthly/notes', '2023-10.md');

        builder.withNameTemplate('yyyy-MM').withValue(month).withPath('/path/to/monthly/notes');
        const result = builder.build();

        expect(result).toBe(expectedPath);
    });

    it('should build the correct file path with custom template', () => {
        const day: Day = { completeDate: new Date('2023-10-01') };
        const week: Week = { days: [day] };
        const month: Month = { weeks: [week] };
        const expectedPath = join('/path/to/monthly/notes', '10-2023.md');

        builder.withNameTemplate('MM-yyyy').withValue(month).withPath('/path/to/monthly/notes');
        const result = builder.build();

        expect(result).toBe(expectedPath);
    });
});