import {DateParser} from 'src-new/infrastructure/contracts/date-parser';
import {DateParserFactory} from 'src-new/infrastructure/contracts/date-parser-factory';

export class DefaultDateParserFactory implements DateParserFactory {
    private parser: DateParser | null = null;

    public register(parser: DateParser): DefaultDateParserFactory {
        this.parser = parser;
        return this;
    }

    public getParser(): DateParser {
        if (!this.parser) {
            throw new Error('No parser registered!');
        }

        return this.parser;
    }
}