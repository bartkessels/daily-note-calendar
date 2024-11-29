import {VariableParser} from 'src/domain/parsers/variable.parser';

export interface VariableParserFactory {
    getVariableParser(variable: string): VariableParser | null;
}