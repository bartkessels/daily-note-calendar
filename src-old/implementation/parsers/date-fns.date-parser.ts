import {DateParser} from 'src-old/domain/parsers/date.parser';
import {format, parse} from 'date-fns';

export class DateFnsDateParser implements DateParser {

    /**
     * Parse the date using the template or returns the template if the template could not
     * be parsed.
     *
     * @param date
     * @param template
     */
    public parse(date: Date, template: string): string {
        try {
            return format(date, template);
        } catch(e) {
            return template;
        }
    }

    /**
     * Parse the date string using the template or returns null if the date could not be parsed.
     *
     * @param date
     * @param template
     */
    public parseString(date: string, template: string): Date | null {
        try {
            return parse(date, template, new Date());
        } catch (e) {
            return null;
        }
    }
}