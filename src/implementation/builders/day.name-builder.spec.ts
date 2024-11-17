import { DayNameBuilder } from 'src/implementation/builders/day.name-builder';
import { Day, DayOfWeek } from 'src/domain/models/day';
import { Logger } from 'src/domain/loggers/logger';
import { DateParser } from 'src/domain/parsers/date.parser';
import 'src/extensions/extensions';

describe('DayNameBuilder', () => {
    const day: Day = {
        dayOfWeek: DayOfWeek.Tuesday,
        date: 12,
        name: '12',
        completeDate: new Date('2024-11-12')
    };

    let logger: Logger;
    let dateParser: DateParser;
    let builder: DayNameBuilder;

    beforeEach(() => {
        logger = {
            logAndThrow: jest.fn((message: string) => {
                throw new Error(message);
            })
        };
        dateParser = {
            parse: jest.fn()
        };
        builder = new DayNameBuilder(dateParser, logger);
    });

    it('should throw an error if template is not provided', () => {
        builder.withValue(day).withPath('/path/to/daily/notes');

        expect(() => builder.build()).toThrow('Could not find the template to create a daily note');
    });

    it('should throw an error if value is not provided', () => {
        builder.withNameTemplate('yyyy-MM-dd').withPath('/path/to/daily/notes');

        expect(() => builder.build()).toThrow('Could not create a daily note because the day is unknown');
    });

    it('should throw an error if path is not provided', () => {
        builder.withNameTemplate('yyyy-MM-dd').withValue(day);

        expect(() => builder.build()).toThrow('Could not find the folder to create the daily note');
    });

    it('should build the correct file path with the template', () => {
        const expectedPath = '/parsed/path/parsed-name.md';

        (dateParser.parse as jest.Mock)
            .mockReturnValueOnce('/parsed/path')
            .mockReturnValueOnce('parsed-name');

        builder.withNameTemplate('dd-MM-yyyy').withValue(day).withPath('/path/to/daily/notes');
        const result = builder.build();

        expect(result).toBe(expectedPath);
        expect(dateParser.parse).toHaveBeenCalledWith(day.completeDate, '/path/to/daily/notes');
        expect(dateParser.parse).toHaveBeenCalledWith(day.completeDate, 'dd-MM-yyyy');
    });
});