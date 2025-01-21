export interface VariableParser<T> {
    parseVariables(content: string, value: T): string;
}