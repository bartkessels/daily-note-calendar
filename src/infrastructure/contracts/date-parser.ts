export interface DateParser {
    fromDate(date: Date, template: string, options?: { weekStartsOn?: 0 | 1 | 2 | 3 | 4 | 5 | 6 }): string;
    fromString(date: string, template: string): Date | null;
}