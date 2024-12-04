import {DateParser} from 'src/domain/parsers/date.parser';
import {format} from 'date-fns';

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
}