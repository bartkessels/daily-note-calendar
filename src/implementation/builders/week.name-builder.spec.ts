import {WeekNameBuilder} from 'src/implementation/builders/week.name-builder';
import {Week} from 'src/domain/models/week';
import {Day, DayOfWeek} from 'src/domain/models/day';
import {join} from 'path';
import 'src/extensions/extensions';
import {Logger} from 'src/domain/loggers/logger';
import {DateParser} from 'src/domain/parsers/date.parser';

describe('WeekNameBuilder', () => {
    let logger: Logger;
    let dateParser: DateParser;
    let builder: WeekNameBuilder;
    let week: Week;

    beforeEach(() => {
        logger = {
            logAndThrow: jest.fn((message: string) => {
                throw new Error(message)
            })
        };
        dateParser = {
            parse: jest.fn()
        };
        builder = new WeekNameBuilder(dateParser, logger);
        week = {
            weekNumber: 46,
            days: [<Day> {
                dayOfWeek: DayOfWeek.Tuesday,
                date: 12,
                name: '12',
                completeDate: new Date('2024-11-12')
            }]
        };
    });

    it('should throw an error if template is not provided', () => {
        builder.withValue(week).withPath('/path/to/weekly/notes');

        expect(() => builder.build()).toThrow('Could not find the template to create a weekly note');
    });

    it('should throw an error if value is not provided', () => {
        builder.withNameTemplate('yyyy-\'W\'ww').withPath('/path/to/weekly/notes');

        expect(() => builder.build()).toThrow('Could not create a weekly note because the week is unknown');
    });

    it('should throw an error if week has no days', () => {
        const weekWithoutDays = week;
        weekWithoutDays.days = [];

        builder.withNameTemplate('yyyy-\'W\'ww').withValue(weekWithoutDays).withPath('/path/to/weekly/notes');

        expect(() => builder.build()).toThrow('Could not create a weekly note because the week does not have days');
    });

    it('should throw an error if path is not provided', () => {
        builder.withNameTemplate('yyyy-\'W\'ww').withValue(week);

        expect(() => builder.build()).toThrow('Could not find the folder to create the weekly note');
    });

    it('should build the correct file path with the template', () => {
        const expectedPath = '/parsed/path/parsed-name.md';
        const expectedDate = week.days[0].completeDate;

        (dateParser.parse as jest.Mock)
            .mockReturnValueOnce('/parsed/path')
            .mockReturnValueOnce('parsed-name');

        builder.withNameTemplate('dd-MM-yyyy').withValue(week).withPath('/path/to/daily/notes');
        const result = builder.build();

        expect(result).toBe(expectedPath);
        expect(dateParser.parse).toHaveBeenCalledWith(expectedDate, '/path/to/daily/notes');
        expect(dateParser.parse).toHaveBeenCalledWith(expectedDate, 'dd-MM-yyyy');
    });
});