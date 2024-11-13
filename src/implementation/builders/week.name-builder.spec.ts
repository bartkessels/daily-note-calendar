import { WeekNameBuilder } from 'src/implementation/builders/week.name-builder';
import { Week } from 'src/domain/models/Week';
import { Day, DayOfWeek } from 'src/domain/models/Day';
import { join } from 'path';
import 'src/extensions/extensions';

describe('WeekNameBuilder', () => {
    let builder: WeekNameBuilder;
    let week: Week;

    beforeEach(() => {
        builder = new WeekNameBuilder();
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

        expect(() => builder.build()).toThrow('The template is not allowed to be null');
    });

    it('should throw an error if value is not provided', () => {
        builder.withNameTemplate('yyyy-\'W\'ww').withPath('/path/to/weekly/notes');

        expect(() => builder.build()).toThrow('The week is not allowed to be null');
    });

    it('should throw an error if path is not provided', () => {
        builder.withNameTemplate('yyyy-\'W\'ww').withValue(week);

        expect(() => builder.build()).toThrow('The paths is not allowed to be null');
    });

    it('should throw an error if week has no days', () => {
        const weekWithoutDays = week;
        weekWithoutDays.days = [];

        builder.withNameTemplate('yyyy-\'W\'ww').withValue(weekWithoutDays).withPath('/path/to/weekly/notes');

        expect(() => builder.build()).toThrow('The week must have days defined');
    });

    it('should build the correct file path with the template', () => {
        const expectedPath = join('/path/to/weekly/notes', '2024-W46.md');

        builder.withNameTemplate('yyyy-\'W\'ww').withValue(week).withPath('/path/to/weekly/notes');
        const result = builder.build();

        expect(result).toBe(expectedPath);
    });
});