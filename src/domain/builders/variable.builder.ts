import {Variable} from 'src/domain/models/variable';

export interface VariableBuilder {
    fromString(value: string): VariableBuilder;
    withName(template: string): VariableBuilder;
    withTemplate(template: string): VariableBuilder;
    build(): Variable;
}