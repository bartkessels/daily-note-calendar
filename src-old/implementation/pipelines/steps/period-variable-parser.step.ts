import {DateParser} from 'src-old/domain/parsers/date.parser';
import {FileAdapter} from 'src-old/domain/adapters/file.adapter';
import {VariableBuilder} from 'src-old/domain/builders/variable.builder';
import {PostCreateStep} from 'src-old/domain/pipeline/pipeline';
import {Period} from 'src-old/domain/models/period';

export class PeriodVariableParserStep implements PostCreateStep<Period> {
    private readonly variableDeclarationRegex = /{{date.*?}}/g;

    constructor(
        private readonly fileAdapter: FileAdapter,
        private readonly variableBuilder: VariableBuilder,
        private readonly dateParser: DateParser
    ) {

    }

    public async executePostCreate(filePath: string, value: Period): Promise<void> {
        const content = await this.fileAdapter.readFileContents(filePath);
        const updatedContent = content.replace(this.variableDeclarationRegex, (variableDeclaration: string, _: any) => {
            const variable = this.variableBuilder.fromString(variableDeclaration).build();
            const date = value.date;

            if (!date) {
                return variableDeclaration;
            }

            return this.dateParser.parse(date.calculate(variable.calculus), variable.template!);
        });

        await this.fileAdapter.writeFileContents(filePath, updatedContent);
    }
}