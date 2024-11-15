import {NameBuilder} from 'src/domain/builders/name.builder';
import {format} from 'date-fns';
import {Month} from 'src/domain/models/month';
import {Logger} from 'src/domain/loggers/logger';

export class MonthNameBuilder implements NameBuilder<Month> {
    private template?: string;
    private path?: string;
    private month?: Month;

    constructor(
        private readonly logger: Logger
    ) {

    }

    public withNameTemplate(template: string): NameBuilder<Month> {
        this.template = template;
        return this;
    }

    public withValue(value: Month): NameBuilder<Month> {
        this.month = value;
        return this;
    }

    public withPath(path: string): NameBuilder<Month> {
        this.path = path;
        return this;
    }

    public build(): string {
        if (!this.template) {
            this.logger.logAndThrow('Could not find the template to create a monthly note');
        } else if (!this.month) {
            this.logger.logAndThrow('Could not create a monthly note because the month is unknown');
        } else if (this.month.weeks.length <= 0) {
            this.logger.logAndThrow('Could not create a monthly note because the month does not have weeks');
        } else if (this.month.weeks[0].days.length <= 0) {
            this.logger.logAndThrow('Could not create a monthly note because the month does not have days');
        } else if (!this.path) {
            this.logger.logAndThrow('Could not find the folder to create the monthly note');
        }

        const date = this.month.weeks[0].days[0].completeDate;
        const name = format(date, this.template);
        const fileName = name.appendMarkdownExtension();

        return [this.path, fileName].join('/');
    }
}