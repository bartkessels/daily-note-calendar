import {DateParser} from 'src/infrastructure/contracts/date-parser';
import {DateParserFactory} from 'src/infrastructure/contracts/date-parser-factory';
import {DateFnsDateParser} from 'src/infrastructure/parsers/date-fns.date-parser';

export class DefaultDateParserFactory implements DateParserFactory {
    public getParser(): DateParser {
        return new DateFnsDateParser();
    }
}