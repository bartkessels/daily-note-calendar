import {NameBuilder} from 'src/domain/builders/name.builder';
import {Year} from 'src/domain/models/year';
import {format} from 'date-fns';
import {join} from 'path';

export class YearNameBuilder implements NameBuilder<Year> {
    private template?: string;
    private path?: string;
    private year?: Year;

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
            throw new Error('The template is not allowed to be null');
        } else if (!this.year) {
            throw new Error('The year is not allowed to be null');
        } else if (this.year.months.length <= 0) {
            throw new Error('The year must have months defined');
        } else if (this.year.months[0].weeks.length <= 0) {
            throw new Error('The year must have weeks defined');
        } else if (this.year.months[0].weeks[0].days.length <= 0) {
            throw new Error('The year must have days defined');
        } else if (!this.path) {
            throw new Error('The paths is not allowed to be null');
        }

        const date = this.year.months[0].weeks[0].days[0].completeDate;
        const name = format(date, this.template);
        const fileName = name.appendMarkdownExtension();

        return join(this.path, fileName);
    }
}