import {DateParser} from 'src/domain/parsers/date.parser';
import {FileAdapter} from 'src/domain/adapters/file.adapter';
import {VariableBuilder} from 'src/domain/builders/variable.builder';
import {VariableParserStep} from 'src/domain/pipeline/steps/variable-parser.step';

export abstract class DateVariableParserStep implements VariableParserStep<Date> {
    private readonly variableDeclarationRegex = /{{date:.*?}}/g;

    protected constructor(
        private readonly fileAdapter: FileAdapter,
        private readonly variableBuilder: VariableBuilder,
        private readonly dateParser: DateParser
    ) {

    }

    public async executePostCreate(filePath: string, value: Date): Promise<void> {
        const content = await this.fileAdapter.readFileContents(filePath);
        const updatedContent = content.replace(this.variableDeclarationRegex, (variableDeclaration: string, _: any) => {
            const variable = this.variableBuilder.fromString(variableDeclaration).build();
            return this.dateParser.parse(value, variable.template!);
        });

        await this.fileAdapter.writeFileContents(filePath, updatedContent);
    }
}