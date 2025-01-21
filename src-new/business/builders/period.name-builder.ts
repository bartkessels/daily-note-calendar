import {NameBuilder} from 'src-new/business/contracts/name-builder';
import {DateParser} from 'src-new/infrastructure/contracts/date-parser';
import {Period} from 'src-new/domain/models/date.model';

export class PeriodNameBuilder<T extends Period> implements NameBuilder<T> {
    private period?: T;
    private pathTemplate?: string;
    private nameTemplate?: string;

    constructor(
        private readonly dateParser: DateParser
    ) {

    }

    public withPath(template: string): NameBuilder<T> {
        this.pathTemplate = template;
        return this;
    }

    public withName(template: string): NameBuilder<T> {
        this.nameTemplate = template;
        return this
    }

    public withValue(value: T): NameBuilder<T> {
        this.period = value;
        return this;
    }

    public build(): string {
        if (!this.period) {
            throw Error('Period is required!');
        } else if (!this.nameTemplate) {
            throw Error('Name template is required!');
        }

        const path = this.dateParser.fromDate(this.period.date, this.pathTemplate ?? '');
        const name = this.dateParser.fromDate(this.period.date, this.nameTemplate).appendMarkdownExtension();

        if (path.length === 0) {
            return name;
        }

        return [path, name].join('/');
    }
}