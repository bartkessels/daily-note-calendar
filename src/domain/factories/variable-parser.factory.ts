import {VariableParser} from 'src/domain/parsers/variable.parser';
import {Variable} from 'src/domain/models/variable';

export interface VariableParserFactory {
    getVariableParser(variable: Variable): VariableParser;
}