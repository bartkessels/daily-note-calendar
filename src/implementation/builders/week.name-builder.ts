import {NameBuilder} from 'src/domain/builders/name.builder';
import {Week} from 'src/domain/models/week';
import {Logger} from 'src/domain/loggers/logger';
import {DateParser} from 'src/domain/parsers/date.parser';

export class WeekNameBuilder implements NameBuilder<Week> {
    private template?: string;
    private path?: string;
    private week?: Week;

    constructor(
        private readonly dateParser: DateParser,
        private readonly logger: Logger
    ) {

    }

    public withNameTemplate(template: string): NameBuilder<Week> {
        this.template = template;
        return this;
    }

    public withValue(value: Week): NameBuilder<Week> {
        this.week = value;
        return this;
    }

    public withPath(path: string): NameBuilder<Week> {
        this.path = path;
        return this;
    }

    public build(): string {
        if (!this.template) {
            this.logger.logAndThrow('Could not find the template to create a weekly note');
        } else if (!this.week) {
            this.logger.logAndThrow('Could not create a weekly note because the week is unknown');
        } else if (this.week.days.length <= 0) {
            this.logger.logAndThrow('Could not create a weekly note because the week does not have days');
        } else if (!this.path) {
            this.logger.logAndThrow('Could not find the folder to create the weekly note');
        }

        const date = this.week.days[0].completeDate;
        const path = this.dateParser.parse(date, this.path);
        const name = this.dateParser.parse(date, this.template);
        const fileName = name.appendMarkdownExtension();

        return [path, fileName].join('/');
    }
}