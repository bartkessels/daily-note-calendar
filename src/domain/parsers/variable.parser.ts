import {Variable} from 'src/domain/models/variable';

export interface VariableParser {
    create(variable: Variable): VariableParser;
    tryParse(text: string): string;
}