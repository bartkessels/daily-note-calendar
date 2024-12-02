import {FileAdapter} from 'src/domain/adapters/file.adapter';
import {FileProcessor} from 'src/domain/processors/file.processor';
import {Logger} from 'src/domain/loggers/logger';
import {VariableParser} from 'src/domain/parsers/variable.parser';
import {VariableParserFactory} from 'src/domain/factories/variable-parser.factory';
import {VariableBuilder} from 'src/domain/builders/variable.builder';
import {Variable} from 'src/domain/models/variable';
import {Event} from 'src/domain/events/event';

export class VariableFileProcessor implements FileProcessor {
    private readonly variableDeclarationRegex = /{{.*?}}/g;

    constructor(
        noteCreatedEvent: Event<string>,
        private readonly fileAdapter: FileAdapter,
        private readonly variableBuilder: VariableBuilder,
        private readonly variableParserFactory: VariableParserFactory,
        private readonly logger: Logger
    ) {
        noteCreatedEvent.onEvent('VariableFileProcessor', (filePath) => this.process(filePath));
    }

    public async process(filePath: string): Promise<void> {
        const doesFileExist = await this.fileAdapter.doesFileExist(filePath);
        if (!doesFileExist) {
            this.logger.logAndThrow("File does not exist");
        }

        const file = await this.fileAdapter.readFileContents(filePath);
        const updatedFile = file.replace(this.variableDeclarationRegex, (value: string, _: any) => {
            const variable = this.variableBuilder.fromString(value).build();
            return this.variableParserFactory.getVariableParser(variable)
                .tryParse(value);
        });

        await this.fileAdapter.writeFileContents(filePath, updatedFile);
    }
}