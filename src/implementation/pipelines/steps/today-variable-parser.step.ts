import {DateParser} from 'src/domain/parsers/date.parser';
import {FileAdapter} from 'src/domain/adapters/file.adapter';
import {VariableBuilder} from 'src/domain/builders/variable.builder';
import {PostCreateStep} from 'src/domain/pipeline/pipeline';

export class TodayVariableParserStep implements PostCreateStep<any> {
    private readonly variableDeclarationRegex = /{{today:.*?}}/g;

    constructor(
        private readonly fileAdapter: FileAdapter,
        private readonly variableBuilder: VariableBuilder,
        private readonly dateParser: DateParser
    ) {

    }

    public async executePostCreate(filePath: string, _: any): Promise<void> {
        const today = new Date();
        const content = await this.fileAdapter.readFileContents(filePath);
        const updatedContent = content.replace(this.variableDeclarationRegex, (variableDeclaration: string, _: any) => {
            const variable = this.variableBuilder.fromString(variableDeclaration).build();
            return this.dateParser.parse(today, variable.template!);
        });

        await this.fileAdapter.writeFileContents(filePath, updatedContent);
    }
}