export interface DateParser {
    parse(date: Date, template: string): string;
    parseString(date: string, template: string): Date | null;
}