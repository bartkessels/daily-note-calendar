import {NameBuilder} from 'src/business/contracts/name-builder';
import {DateParser} from 'src/infrastructure/contracts/date-parser';
import {Period} from 'src/domain/models/period.model';
import {DateParserFactory} from 'src/infrastructure/contracts/date-parser-factory';
import 'src/extensions/extensions';

export class PeriodNameBuilder implements NameBuilder<Period> {
    private readonly dateParser: DateParser;

    private period?: Period;
    private pathTemplate?: string;
    private nameTemplate?: string;

    constructor(dateParserFactory: DateParserFactory) {
        this.dateParser = dateParserFactory.getParser();
    }

    public withPath(template: string): NameBuilder<Period> {
        this.pathTemplate = template;
        return this;
    }

    public withName(template: string): NameBuilder<Period> {
        this.nameTemplate = template;
        return this
    }

    public withValue(value: Period): NameBuilder<Period> {
        this.period = value;
        return this;
    }

    public build(): string {
        if (!this.period) {
            throw Error('Could not create the note name: Period is required!');
        } else if (!this.nameTemplate) {
            throw Error('Could not create the note name: Name template is required!');
        }

        const path = this.pathTemplate ?? '';
        const name = this.dateParser.fromDate(this.period.date, this.nameTemplate).appendMarkdownExtension();

        if (path.length === 0) {
            return name;
        }

        return [path, name].join('/');
    }
}