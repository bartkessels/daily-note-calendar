import {DateParser} from 'src/domain/parsers/date.parser';
import {FileAdapter} from 'src/domain/adapters/file.adapter';
import {VariableBuilder} from 'src/domain/builders/variable.builder';
import {PostCreateStep} from 'src/domain/pipeline/pipeline';
import {CalculusOperator} from 'src/domain/models/variable';

export abstract class PeriodicVariableParserStep<T> implements PostCreateStep<T> {
    private readonly variableDeclarationRegex = /{{date.*}}/g;

    protected constructor(
        private readonly fileAdapter: FileAdapter,
        private readonly variableBuilder: VariableBuilder,
        private readonly dateParser: DateParser
    ) {

    }

    protected abstract getDate(value: T): Date | null;

    public async executePostCreate(filePath: string, value: T): Promise<void> {
        const content = await this.fileAdapter.readFileContents(filePath);
        const updatedContent = content.replace(this.variableDeclarationRegex, (variableDeclaration: string, _: any) => {
            const variable = this.variableBuilder.fromString(variableDeclaration).build();
            const date = this.getDate(value);

            if (!date) {
                return variableDeclaration;
            }

            return this.dateParser.parse(date.calculate(variable.calculus), variable.template!);
        });

        await this.fileAdapter.writeFileContents(filePath, updatedContent);
    }
}