import {Month} from 'src/domain/models/month';
import {Week} from 'src/domain/models/week';
import {Day, DayOfWeek} from 'src/domain/models/day';
import {join} from 'path';
import 'src/extensions/extensions';
import {Year} from 'src/domain/models/year';
import {YearNameBuilder} from 'src/implementation/builders/year.name-builder';
import {Logger} from 'src/domain/loggers/logger';

describe('YearNameBuilder', () => {
    let logger: Logger;
    let builder: YearNameBuilder;
    let year: Year;

    beforeEach(() => {
        logger = {
            logAndThrow: jest.fn((message: string) => {
                throw new Error(message)
            })
        };
        builder = new YearNameBuilder(logger);
        year = {
            year: 2024,
            name: '2024',
            months: [<Month>{
                monthIndex: 11,
                year: 2024,
                name: 'November',
                number: 12,
                weeks: [<Week>{
                    weekNumber: 46,
                    days: [<Day>{
                        dayOfWeek: DayOfWeek.Tuesday,
                        date: 12,
                        name: '12',
                        completeDate: new Date('2024-11-12')
                    }]
                }]
            }]
        }
    });

    it('should throw an error if template is not provided', () => {
        builder.withValue(year).withPath('/path/to/monthly/notes');

        expect(() => builder.build()).toThrow('Could not find the template to create a yearly note');
    });

    it('should throw an error if value is not provided', () => {
        builder.withNameTemplate('yyyy-MM').withPath('/path/to/monthly/notes');

        expect(() => builder.build()).toThrow('Could not create a yearly note because the year is unknown');
    });

    it('should throw an error if year has no months', () => {
        const yearWithoutMonths = year;
        yearWithoutMonths.months = [];

        builder.withNameTemplate('yyyy-MM').withValue(yearWithoutMonths).withPath('/path/to/monthly/notes');

        expect(() => builder.build()).toThrow('Could not create a yearly note because the year does not have months');
    });

    it('should throw an error if year has no weeks', () => {
        const yearWithoutWeeks = year;
        yearWithoutWeeks.months[0].weeks = [];

        builder.withNameTemplate('yyyy-MM').withValue(yearWithoutWeeks).withPath('/path/to/monthly/notes');

        expect(() => builder.build()).toThrow('Could not create a yearly note because the year does not have weeks');
    });

    it('should throw an error if year has weeks with no days', () => {
        const yearWithoutDays = year;
        yearWithoutDays.months[0].weeks[0].days = [];

        builder.withNameTemplate('yyyy-MM').withValue(yearWithoutDays).withPath('/path/to/monthly/notes');

        expect(() => builder.build()).toThrow('Could not create a yearly note because the year does not have days');
    });

    it('should throw an error if path is not provided', () => {
        builder.withNameTemplate('yyyy-MM').withValue(year);

        expect(() => builder.build()).toThrow('Could not find the folder to create the yearly note');
    });

    it('should build the correct file path with the template', () => {
        const expectedPath = join('/path/to/monthly/notes', '11-2024.md');

        builder.withNameTemplate('MM-yyyy').withValue(year).withPath('/path/to/monthly/notes');
        const result = builder.build();

        expect(result).toBe(expectedPath);
    });
});