import {Period} from 'src/domain/models/period';
import {NameBuilder} from 'src/domain/builders/name.builder';
import {DateParser} from 'src/domain/parsers/date.parser';
import {Logger} from 'src/domain/loggers/logger';

export class PeriodNameBuilder<T extends Period> implements NameBuilder<T> {
    private template?: string;
    private path?: string;
    private value?: T;

    constructor(
        private readonly dateParser: DateParser,
        private readonly logger: Logger
    ) {

    }

    public withNameTemplate(template: string): NameBuilder<T> {
        this.template = template;
        return this;
    }

    public withValue(value: T): NameBuilder<T> {
        this.value = value;
        return this;
    }

    public withPath(path: string): NameBuilder<T> {
        this.path = path;
        return this;
    }

    public build(): string {
        if (!this.template) {
            this.logger.logAndThrow('Could not find the template to create a yearly note');
        } else if (!this.value) {
            this.logger.logAndThrow('Could not create a note because the period is unknown');
        } else if (!this.path) {
            this.logger.logAndThrow('Could not find the folder to create the yearly note');
        }

        const path = this.dateParser.parse(this.value.date, this.path);
        const name = this.dateParser.parse(this.value.date, this.template);
        const fileName = name.appendMarkdownExtension();

        return [path, fileName].join('/');
    }
}