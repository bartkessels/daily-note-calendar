import {Variable} from 'src-old/domain/models/variable';

export interface VariableBuilder {
    fromString(value: string): VariableBuilder;
    build(): Variable;
}