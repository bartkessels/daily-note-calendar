import {NameBuilder} from "src/domain/builders/name.builder";
import {Day} from "src/domain/models/day";
import {format} from "date-fns";
import {join} from "path";

export class DayNameBuilder implements NameBuilder<Day> {
    private template?: string;
    private path?: string;
    private day?: Day;

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
            throw new Error('The template is not allowed to be null');
        } else if (!this.day) {
            throw new Error('The day is not allowed to be null');
        } else if (!this.path) {
            throw new Error('The paths is not allowed to be null');
        }

        const name = format(this.day.completeDate, this.template);
        const fileName = name.appendMarkdownExtension();

        return join(this.path, fileName);
    }
}