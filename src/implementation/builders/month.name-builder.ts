import {NameBuilder} from "src/domain/builders/name.builder";
import {format} from "date-fns";
import {join} from "path";
import {Month} from "src/domain/models/Month";

export class MonthNameBuilder implements NameBuilder<Month> {
    private template?: string;
    private path?: string;
    private month?: Month;

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
            throw new Error('The template is not allowed to be null');
        } else if (!this.month) {
            throw new Error('The month is not allowed to be null');
        } else if (this.month.weeks.length <= 0) {
            throw new Error('The month must have weeks defined');
        } else if (this.month.weeks[0].days.length <= 0) {
            throw new Error('The month must have days defined');
        } else if (!this.path) {
            throw new Error('The paths is not allowed to be null');
        }

        const date = this.month.weeks[0].days[0].completeDate;
        const name = format(date, this.template);
        const fileName = name.appendMarkdownExtension();

        return join(this.path, fileName);
    }
}