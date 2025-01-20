import {format, parse} from 'date-fns';
import {DateParser} from 'src-new/infrastructure/contracts/date-parser';

export class DateFnsDateParser implements DateParser {

    /**
     * Parse the date using the template or returns the template if the template could not
     * be parsed.
     *
     * @param date
     * @param template
     */
    public fromDate(date: Date, template: string): string {
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
    public fromString(date: string, template: string): Date | null {
        try {
            return parse(date, template, new Date());
        } catch (e) {
            return null;
        }
    }
}