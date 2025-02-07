import {Variable} from 'src/domain/models/variable.model';

export interface VariableFactory {
    getVariable(value: string): Variable;
}