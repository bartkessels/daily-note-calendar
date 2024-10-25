import { format } from "date-fns";
import { join } from "path";
import { FileNameBuilder } from "src/domain/builders/FileNameBuilder";

export class DateFileNameBuilder implements FileNameBuilder<Date> {
    private template?: string;
    private path?: string;
    private value?: Date;

    public withNameTemplate(template: string): FileNameBuilder<Date> {
        this.template = template;
        return this;
    }
    
    public withValue(value: Date): FileNameBuilder<Date> {
        this.value = value;
        return this;
    }

    public withPath(path: string): FileNameBuilder<Date> {
        this.path = path;
        return this;
    }
    
    public build(): string {
        const template = this.template ?? '';
        const date = this.value ?? new Date();
        const path = this.path ?? '';
        
        const name = format(date, template);
        const fileName = name.appendMarkdownExtension();

        return join(path, fileName);
    }
}