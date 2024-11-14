import {MonthNameBuilder} from 'src/implementation/builders/month.name-builder';
import {Month} from 'src/domain/models/month';
import {Week} from 'src/domain/models/week';
import {Day, DayOfWeek} from 'src/domain/models/day';
import {join} from 'path';
import 'src/extensions/extensions';
import {Logger} from 'src/domain/loggers/logger';

describe('MonthNameBuilder', () => {
    let logger: Logger;
    let builder: MonthNameBuilder;
    let month: Month;

    beforeEach(() => {
        logger = {
            logAndThrow: jest.fn((message: string) => {
                throw new Error(message)
            })
        };
        builder = new MonthNameBuilder(logger);
        month = {
            monthIndex: 11,
            quarter: 4,
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

        expect(() => builder.build()).toThrow('Could not find the template to create a monthly note');
    });

    it('should throw an error if value is not provided', () => {
        builder.withNameTemplate('yyyy-MM').withPath('/path/to/monthly/notes');

        expect(() => builder.build()).toThrow('Could not create a monthly note because the month is unknown');
    });

    it('should throw an error if month has no weeks', () => {
        const monthWithoutWeeks = month;
        monthWithoutWeeks.weeks = [];

        builder.withNameTemplate('yyyy-MM').withValue(monthWithoutWeeks).withPath('/path/to/monthly/notes');

        expect(() => builder.build()).toThrow('Could not create a monthly note because the month does not have weeks');
    });

    it('should throw an error if month has weeks with no days', () => {
        const monthWithoutDays = month;
        monthWithoutDays.weeks[0].days = [];

        builder.withNameTemplate('yyyy-MM').withValue(monthWithoutDays).withPath('/path/to/monthly/notes');

        expect(() => builder.build()).toThrow('Could not create a monthly note because the month does not have days');
    });

    it('should throw an error if path is not provided', () => {
        builder.withNameTemplate('yyyy-MM').withValue(month);

        expect(() => builder.build()).toThrow('Could not find the folder to create the monthly note');
    });

    it('should build the correct file path with the template', () => {
        const expectedPath = join('/path/to/monthly/notes', '11-2024.md');

        builder.withNameTemplate('MM-yyyy').withValue(month).withPath('/path/to/monthly/notes');
        const result = builder.build();

        expect(result).toBe(expectedPath);
    });
});