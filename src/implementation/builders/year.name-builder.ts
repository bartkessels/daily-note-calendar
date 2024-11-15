import {NameBuilder} from 'src/domain/builders/name.builder';
import {Year} from 'src/domain/models/year';
import {format} from 'date-fns';
import {Logger} from 'src/domain/loggers/logger';

export class YearNameBuilder implements NameBuilder<Year> {
    private template?: string;
    private path?: string;
    private year?: Year;

    constructor(
        private readonly logger: Logger
    ) {

    }

    public withNameTemplate(template: string): NameBuilder<Year> {
        this.template = template;
        return this;
    }

    public withValue(value: Year): NameBuilder<Year> {
        this.year = value;
        return this;
    }

    public withPath(path: string): NameBuilder<Year> {
        this.path = path;
        return this;
    }

    public build(): string {
        if (!this.template) {
            this.logger.logAndThrow('Could not find the template to create a yearly note');
        } else if (!this.year) {
            this.logger.logAndThrow('Could not create a yearly note because the year is unknown');
        } else if (this.year.months.length <= 0) {
            this.logger.logAndThrow('Could not create a yearly note because the year does not have months');
        } else if (this.year.months[0].weeks.length <= 0) {
            this.logger.logAndThrow('Could not create a yearly note because the year does not have weeks');
        } else if (this.year.months[0].weeks[0].days.length <= 0) {
            this.logger.logAndThrow('Could not create a yearly note because the year does not have days');
        } else if (!this.path) {
            this.logger.logAndThrow('Could not find the folder to create the yearly note');
        }

        const date = this.year.months[0].weeks[0].days[0].completeDate;
        const name = format(date, this.template);
        const fileName = name.appendMarkdownExtension();

        return [this.path, fileName].join('/');
    }
}