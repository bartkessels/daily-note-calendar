import {format, parse} from 'date-fns';
import {DateParser} from 'src/infrastructure/contracts/date-parser';

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
            const parsedDate = parse(date, template, new Date());

            if (isNaN(parsedDate.getDate())) {
                return null;
            }

            return parsedDate;
        } catch (e) {
            return null;
        }
    }
}