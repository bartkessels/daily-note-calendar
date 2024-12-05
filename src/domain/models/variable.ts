export interface Variable {
    name: string;
    template: string | null;
    type: VariableType;
}

export enum VariableType {
    Date,
    Today,
    Title
}
