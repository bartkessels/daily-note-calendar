import {NameBuilder} from 'src/business/contracts/name-builder';
import {DateParser} from 'src/infrastructure/contracts/date-parser';
import {Period} from 'src/domain/models/period.model';
import {DateParserFactory} from 'src/infrastructure/contracts/date-parser-factory';
import {DayOfWeek} from 'src/domain/models/week';
import 'src/extensions/extensions';

export class PeriodNameBuilder implements NameBuilder<Period> {
    private readonly dateParser: DateParser;

    private period?: Period;
    private pathTemplate?: string;
    private nameTemplate?: string;
    private weekStartsOn?: DayOfWeek;

    constructor(dateParserFactory: DateParserFactory) {
        this.dateParser = dateParserFactory.getParser();
    }

    public withPath(template: string): NameBuilder<Period> {
        this.pathTemplate = template;
        return this;
    }

    public withName(template: string): NameBuilder<Period> {
        this.nameTemplate = template;
        return this;
    }

    public withValue(value: Period): NameBuilder<Period> {
        this.period = value;
        return this;
    }

    public withWeekStartsOn(day: DayOfWeek): NameBuilder<Period> {
        this.weekStartsOn = day;
        return this;
    }

    public build(): string {
        if (!this.period) {
            throw Error('Could not create the note name: Period is required!');
        } else if (!this.nameTemplate) {
            throw Error('Could not create the note name: Name template is required!');
        }

        const options = { weekStartsOn: this.weekStartsOn as 0 | 1 | 2 | 3 | 4 | 5 | 6 | undefined };
        const path = this.dateParser.fromDate(this.period.date, this.pathTemplate ?? '', options);
        const name = this.dateParser.fromDate(this.period.date, this.nameTemplate, options).appendMarkdownExtension();

        if (path.length === 0) {
            return name;
        }

        return [path, name].join('/');
    }
}