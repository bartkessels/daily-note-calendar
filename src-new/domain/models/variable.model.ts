export interface Variable {
    name: string;
    template: string | null;
    calculus?: Calculus | null;
    type: VariableType;
}

export interface Calculus {
    unit: string;
    operator: CalculusOperator;
    value: number;
}

export enum CalculusOperator {
    Add = '+',
    Subtract = '-'
}

export enum VariableType {
    Date,
    Today,
    Title
}
