import {Variable} from 'src/domain/models/variable';

export interface VariableBuilder {
    fromString(value: string): VariableBuilder;
    build(): Variable;
}