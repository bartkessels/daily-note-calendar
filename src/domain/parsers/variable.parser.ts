import {Variable} from 'src/domain/models/variable';

export abstract class VariableParser {
    private readonly variableTemplateCleanupRegex = /{{|}}/g;
    private readonly variableTemplateSplitCharacter = ':';

    public tryParse(date: Date, text: string): Variable | null {
        const cleanVariable = text.replace(this.variableTemplateCleanupRegex, '');
        const splitVariable = cleanVariable.split(this.variableTemplateSplitCharacter);

        if (splitVariable.length >= 2) {
            return this.parseVariable(date, splitVariable[0], splitVariable[1]);
        }

        return this.parseVariable(date, splitVariable[0]);
    }

    protected abstract parseVariable(date: Date, name: string, template?: string | undefined): Variable;
}