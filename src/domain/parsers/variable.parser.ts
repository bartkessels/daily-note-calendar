import {Variable} from 'src/domain/models/variable';

export interface VariableParser<T> {
    setValue(value: T): void;
    tryParse(variable: Variable, text: string): string;
}