import {Variable} from 'src-new/domain/models/variable.model';

export interface VariableFactory {
    getVariable(value: string): Variable;
}