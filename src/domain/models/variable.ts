export interface Variable {
    name: string;
    template: string | null;
    value: string | null;
    type: VariableType;
}

export enum VariableType {
    Date,
    Time,
    Title
}