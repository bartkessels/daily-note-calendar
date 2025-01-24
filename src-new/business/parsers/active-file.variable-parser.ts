import {VariableParser} from 'src-new/business/contracts/variable-parser';

export class ActiveFileVariableParser implements VariableParser<string> {
    private static readonly variablePattern = /{{title}}/g;

    public parseVariables(content: string, value: string): string {
        return content.replace(ActiveFileVariableParser.variablePattern, value);
    }
}