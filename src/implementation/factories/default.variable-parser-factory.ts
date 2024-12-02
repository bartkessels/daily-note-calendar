import {VariableParserFactory} from 'src/domain/factories/variable-parser.factory';
import {VariableParser} from 'src/domain/parsers/variable.parser';
import {Variable, VariableType} from 'src/domain/models/variable';
import {Logger} from 'src/domain/loggers/logger';

export class DefaultVariableParserFactory implements VariableParserFactory {
    private readonly parsers: Map<VariableType, VariableParser<any>>;

    constructor(
        private readonly logger: Logger
    ) {

    }

    public registerVariableParser<T>(type: VariableType, parser: VariableParser<T>): void {
        this.parsers.set(type, parser);
    }

    public getVariableParser<T>(variable: Variable): VariableParser<T> {
        const parser = this.parsers.get(variable.type);

        if (!parser) {
            this.logger.logAndThrow('Could not find a parser for the variable');
        }

        return parser as VariableParser<T>;
    }
}