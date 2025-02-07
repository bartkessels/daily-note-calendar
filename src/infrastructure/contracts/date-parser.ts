export interface DateParser {
    fromDate(date: Date, template: string): string;
    fromString(date: string, template: string): Date | null;
}