export interface DateParser {
    parse(date: Date, template: string): string;
}