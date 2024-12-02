import {VariableParserFactory} from 'src/domain/factories/variable-parser.factory';
import {VariableParser} from 'src/domain/parsers/variable.parser';
import {Variable, VariableType} from 'src/domain/models/variable';
import {Logger} from 'src/domain/loggers/logger';
import {TodayVariableParser} from 'src/implementation/parsers/today.variable-parser';
import {DateVariableParser} from 'src/implementation/parsers/date.variable-parser';

export class DefaultVariableParserFactory implements VariableParserFactory {
    private readonly parsers: Map<VariableType, VariableParser>;

    constructor(
        dateParser: DateVariableParser,
        todayParser: TodayVariableParser,
        titleParser: VariableParser,
        private readonly logger: Logger
    ) {
        this.parsers = new Map([
            [VariableType.Date, dateParser],
            [VariableType.Today, todayParser],
            [VariableType.Title, titleParser]
        ]);
    }

    public getVariableParser(variable: Variable): VariableParser {
        const parser = this.parsers.get(variable.type);

        if (!parser) {
            this.logger.logAndThrow('Could not find a parser for the variable');
        }

        return parser.create(variable);
    }
}