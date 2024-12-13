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

export function fromRegex(string: string): Calculus | null {
    const regex= /([+-])(\d+)([.?])/;
    const [_, operator, value, unit] = regex.exec(string) || [];

    if (!operator || !value || !unit) {
        return null;
    }

    let calculusOperator = CalculusOperator.Add;
    if (operator === CalculusOperator.Subtract.valueOf()) {
        calculusOperator = CalculusOperator.Subtract;
    }

    return {
        unit: unit,
        operator: calculusOperator,
        value: parseInt(value)
    };
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
