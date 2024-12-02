import {VariableParser} from 'src/domain/parsers/variable.parser';
import {Variable, VariableType} from 'src/domain/models/variable';

export interface VariableParserFactory {
    registerVariableParser(type: VariableType, parser: VariableParser<any>): void;
    getVariableParser<T>(variable: Variable): VariableParser<T>;
}