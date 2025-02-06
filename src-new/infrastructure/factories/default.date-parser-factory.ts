import {DateParser} from 'src-new/infrastructure/contracts/date-parser';
import {DateParserFactory} from 'src-new/infrastructure/contracts/date-parser-factory';
import {DateFnsDateParser} from 'src-new/infrastructure/parsers/date-fns.date-parser';

export class DefaultDateParserFactory implements DateParserFactory {
    public getParser(): DateParser {
        return new DateFnsDateParser();
    }
}