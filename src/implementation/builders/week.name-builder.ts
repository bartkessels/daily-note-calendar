import {NameBuilder} from "src/domain/builders/name.builder";
import {format} from "date-fns";
import {join} from "path";
import {Week} from "src/domain/models/week";

export class WeekNameBuilder implements NameBuilder<Week> {
    private template?: string;
    private path?: string;
    private week?: Week;

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
            throw new Error('The template is not allowed to be null');
        } else if (!this.week) {
            throw new Error('The week is not allowed to be null');
        } else if (this.week.days.length <= 0) {
            throw new Error('The week must have days defined');
        } else if (!this.path) {
            throw new Error('The paths is not allowed to be null');
        }

        const date = this.week.days[0].completeDate;
        const name = format(date, this.template);
        const fileName = name.appendMarkdownExtension();

        return join(this.path, fileName);
    }
}