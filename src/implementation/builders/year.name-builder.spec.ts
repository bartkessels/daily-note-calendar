import {Month} from 'src/domain/models/month';
import {Week} from 'src/domain/models/week';
import {Day, DayOfWeek} from 'src/domain/models/day';
import {join} from 'path';
import 'src/extensions/extensions';
import {Year} from 'src/domain/models/year';
import {YearNameBuilder} from 'src/implementation/builders/year.name-builder';

describe('YearNameBuilder', () => {
    let builder: YearNameBuilder;
    let year: Year;

    beforeEach(() => {
        builder = new YearNameBuilder();
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

        expect(() => builder.build()).toThrow('The template is not allowed to be null');
    });

    it('should throw an error if value is not provided', () => {
        builder.withNameTemplate('yyyy-MM').withPath('/path/to/monthly/notes');

        expect(() => builder.build()).toThrow('The year is not allowed to be null');
    });

    it('should throw an error if path is not provided', () => {
        builder.withNameTemplate('yyyy-MM').withValue(year);

        expect(() => builder.build()).toThrow('The paths is not allowed to be null');
    });

    it('should throw an error if year has no months', () => {
        const yearWithoutMonths = year;
        yearWithoutMonths.months = [];

        builder.withNameTemplate('yyyy-MM').withValue(yearWithoutMonths).withPath('/path/to/monthly/notes');

        expect(() => builder.build()).toThrow('The year must have months defined');
    });

    it('should throw an error if year has no weeks', () => {
        const yearWithoutWeeks = year;
        yearWithoutWeeks.months[0].weeks = [];

        builder.withNameTemplate('yyyy-MM').withValue(yearWithoutWeeks).withPath('/path/to/monthly/notes');

        expect(() => builder.build()).toThrow('The year must have weeks defined');
    });

    it('should throw an error if year has weeks with no days', () => {
        const yearWithoutDays = year;
        yearWithoutDays.months[0].weeks[0].days = [];

        builder.withNameTemplate('yyyy-MM').withValue(yearWithoutDays).withPath('/path/to/monthly/notes');

        expect(() => builder.build()).toThrow('The year must have days defined');
    });

    it('should build the correct file path with the template', () => {
        const expectedPath = join('/path/to/monthly/notes', '11-2024.md');

        builder.withNameTemplate('MM-yyyy').withValue(year).withPath('/path/to/monthly/notes');
        const result = builder.build();

        expect(result).toBe(expectedPath);
    });
});