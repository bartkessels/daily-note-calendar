import { format } from "date-fns";
import { join } from "path";
import { NameBuilder } from "src/domain/builders/name.builder";

export class DateNameBuilder implements NameBuilder<Date> {
    private static readonly DEFAULT_TEMPLATE = 'yyyy-MM-dd';

    private template?: string;
    private path?: string;
    private value?: Date;

    public withNameTemplate(template: string): NameBuilder<Date> {
        this.template = template;
        return this;
    }
    
    public withValue(value: Date): NameBuilder<Date> {
        this.value = value;
        return this;
    }

    public withPath(path: string): NameBuilder<Date> {
        this.path = path;
        return this;
    }
    
    public build(): string {
        const template = this.template ?? DateNameBuilder.DEFAULT_TEMPLATE;
        const date = this.value ?? new Date();
        const path = this.path ?? '';
        
        const name = format(date, template);
        const fileName = name.appendMarkdownExtension();

        return join(path, fileName);
    }
}