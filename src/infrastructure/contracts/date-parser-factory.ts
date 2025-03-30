import {DateParser} from 'src/infrastructure/contracts/date-parser';

export interface DateParserFactory {
    getParser(): DateParser;
}