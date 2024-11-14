import {DayNameBuilder} from 'src/implementation/builders/day.name-builder';
import {Day, DayOfWeek} from 'src/domain/models/day';
import {join} from 'path';
import 'src/extensions/extensions';

describe('DayNameBuilder', () => {
    const day: Day = {
        dayOfWeek: DayOfWeek.Tuesday,
        date: 12,
        name: '12',
        completeDate: new Date('2024-11-12')
    };

    let builder: DayNameBuilder;

    beforeEach(() => {
        builder = new DayNameBuilder();
    });

    it('should throw an error if template is not provided', () => {
        builder.withValue(day).withPath('/path/to/daily/notes');

        expect(() => builder.build()).toThrow('The template is not allowed to be null');
    });

    it('should throw an error if value is not provided', () => {
        builder.withNameTemplate('yyyy-MM-dd').withPath('/path/to/daily/notes');

        expect(() => builder.build()).toThrow('The day is not allowed to be null');
    });

    it('should throw an error if path is not provided', () => {
        builder.withNameTemplate('yyyy-MM-dd').withValue(day);

        expect(() => builder.build()).toThrow('The paths is not allowed to be null');
    });

    it('should build the correct file path with template', () => {
        const expectedPath = join('/path/to/daily/notes', '12-11-2024.md');

        builder.withNameTemplate('dd-MM-yyyy').withValue(day).withPath('/path/to/daily/notes');
        const result = builder.build();

        expect(result).toBe(expectedPath);
    });
});