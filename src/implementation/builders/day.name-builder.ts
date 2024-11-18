import {NameBuilder} from 'src/domain/builders/name.builder';
import {Day} from 'src/domain/models/day';
import {Logger} from 'src/domain/loggers/logger';
import {DateParser} from 'src/domain/parsers/date.parser';

export class DayNameBuilder implements NameBuilder<Day> {
    private template?: string;
    private path?: string;
    private day?: Day;

    constructor(
        private readonly dateParser: DateParser,
        private readonly logger: Logger
    ) {

    }

    public withNameTemplate(template: string): NameBuilder<Day> {
        this.template = template;
        return this;
    }

    public withValue(value: Day): NameBuilder<Day> {
        this.day = value;
        return this;
    }

    public withPath(path: string): NameBuilder<Day> {
        this.path = path;
        return this;
    }

    public build(): string {
        if (!this.template) {
            this.logger.logAndThrow('Could not find the template to create a daily note');
        } else if (!this.day) {
            this.logger.logAndThrow('Could not create a daily note because the day is unknown');
        } else if (!this.path) {
            this.logger.logAndThrow('Could not find the folder to create the daily note');
        }

        const path = this.dateParser.parse(this.day.completeDate, this.path);
        const name = this.dateParser.parse(this.day.completeDate, this.template);
        const fileName = name.appendMarkdownExtension();

        return [path, fileName].join('/');
    }
}