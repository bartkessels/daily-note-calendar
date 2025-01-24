import {DateParser} from 'src-new/infrastructure/contracts/date-parser';

export interface DateParserFactory {
    getParser(): DateParser;
}