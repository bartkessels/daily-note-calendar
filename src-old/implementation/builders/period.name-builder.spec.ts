import {PeriodNameBuilder} from 'src-old/implementation/builders/period.name-builder';
import {DateParser} from 'src-old/domain/parsers/date.parser';
import {Logger} from 'src-old/domain/loggers/logger';
import {Day, DayOfWeek} from 'src-old/domain/models/day';
import 'src-old/extensions/extensions';

describe('PeriodNameBuilder', () => {
    let dateParser: jest.Mocked<DateParser>;
    let logger: jest.Mocked<Logger>;
    let builder: PeriodNameBuilder<Day>;

    beforeEach(() => {
        dateParser = {
            parse: jest.fn((_: Date, template: string) => template),
            parseString: jest.fn()
        } as jest.Mocked<DateParser>;

        logger = {
            logAndThrow: jest.fn((message: string) => {
                throw new Error(message);
            })
        } as jest.Mocked<Logger>;

        builder = new PeriodNameBuilder<Day>(dateParser, logger);
    });

    it('should build a name with the provided template, value, and path', () => {
        const day: Day = { date: new Date(2023, 9, 2), name: '2', dayOfWeek: DayOfWeek.Monday };

        const result = builder
            .withNameTemplate('yyyy-MM-dd')
            .withValue(day)
            .withPath('/notes')
            .build();

        expect(result).toBe('/notes/yyyy-MM-dd.md');
        expect(dateParser.parse).toHaveBeenCalledWith(day.date, 'yyyy-MM-dd');
    });

    it('should throw an error if template is not provided', () => {
        const day: Day = { date: new Date(2023, 9, 2), name: '2', dayOfWeek: DayOfWeek.Monday };

        expect(() => builder.withValue(day).withPath('/notes').build()).toThrow();
        expect(logger.logAndThrow).toHaveBeenCalledWith('Could not find the template to create a yearly note');
    });

    it('should throw an error if value is not provided', () => {
        expect(() => builder.withNameTemplate('yyyy-MM-dd').withPath('/notes').build()).toThrow();
        expect(logger.logAndThrow).toHaveBeenCalledWith('Could not create a note because the period is unknown');
    });

    it('should throw an error if path is not provided', () => {
        const day: Day = { date: new Date(2023, 9, 2), name: '2', dayOfWeek: DayOfWeek.Monday };

        expect(() => builder.withNameTemplate('yyyy-MM-dd').withValue(day).build()).toThrow();
        expect(logger.logAndThrow).toHaveBeenCalledWith('Could not find the folder to create the yearly note');
    });
});