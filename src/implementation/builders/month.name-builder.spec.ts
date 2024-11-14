import {MonthNameBuilder} from 'src/implementation/builders/month.name-builder';
import {Month} from 'src/domain/models/month';
import {Week} from 'src/domain/models/week';
import {Day, DayOfWeek} from 'src/domain/models/day';
import {join} from 'path';
import 'src/extensions/extensions';

describe('MonthNameBuilder', () => {
    let builder: MonthNameBuilder;
    let month: Month;

    beforeEach(() => {
        builder = new MonthNameBuilder();
        month = {
            monthIndex: 11,
            year: 2024,
            name: 'November',
            number: 12,
            weeks: [<Week> {
                weekNumber: 46,
                days: [<Day> {
                    dayOfWeek: DayOfWeek.Tuesday,
                    date: 12,
                    name: '12',
                    completeDate: new Date('2024-11-12')
                }]
            }]
        };
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
        const monthWithoutWeeks = month;
        monthWithoutWeeks.weeks = [];

        builder.withNameTemplate('yyyy-MM').withValue(monthWithoutWeeks).withPath('/path/to/monthly/notes');

        expect(() => builder.build()).toThrow('The month must have weeks defined');
    });

    it('should throw an error if month has weeks with no days', () => {
        const monthWithoutDays = month;
        monthWithoutDays.weeks[0].days = [];

        builder.withNameTemplate('yyyy-MM').withValue(monthWithoutDays).withPath('/path/to/monthly/notes');

        expect(() => builder.build()).toThrow('The month must have days defined');
    });

    it('should build the correct file path with the template', () => {
        const expectedPath = join('/path/to/monthly/notes', '11-2024.md');

        builder.withNameTemplate('MM-yyyy').withValue(month).withPath('/path/to/monthly/notes');
        const result = builder.build();

        expect(result).toBe(expectedPath);
    });
});