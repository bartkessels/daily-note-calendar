import {FileService} from 'src/domain/services/file.service';
import {FileAdapter} from 'src/domain/adapters/file.adapter';
import {Logger} from 'src/domain/loggers/logger';
import {VariableParser} from 'src/domain/parsers/variable.parser';
import {VariableType} from 'src/domain/models/variable';
import {VariableBuilder} from 'src/domain/builders/variable.builder';
import {VariableParserFactory} from 'src/domain/factories/variable-parser.factory';

export class AdapterFileService implements FileService {
    private readonly variableDeclarationRegex = /{{.*?}}/g;

    constructor(
        private readonly fileAdapter: FileAdapter,
        private readonly variableParserFactory: VariableParserFactory,
        private readonly variableBuilder: VariableBuilder,
        private readonly logger: Logger
    ) {

    }

    public registerVariableParser<T>(type: VariableType, parser: VariableParser<T>): void {
        this.variableParserFactory.registerVariableParser(type, parser);
    }

    public async tryOpenFileWithTemplate(filePath: string, templateFilePath: string): Promise<void> {
        const completeFilePath = filePath.appendMarkdownExtension()
        const completeTemplateFilePath = templateFilePath.appendMarkdownExtension()

        const fileExists = await this.fileAdapter.doesFileExist(completeFilePath);
        const templateFileExists = await this.fileAdapter.doesFileExist(completeTemplateFilePath);

        if (!templateFileExists) {
            this.logger.logAndThrow(`Template file does not exist: ${completeTemplateFilePath}`);
        } else if (!fileExists) {
            await this.fileAdapter.createFileFromTemplate(completeFilePath, completeTemplateFilePath);
            await this.parseVariables(completeTemplateFilePath);
        }

        await this.fileAdapter.openFile(completeFilePath);
    }

    public async tryOpenFile(filePath: string): Promise<void> {
        const completeFilePath = filePath.appendMarkdownExtension()

        const fileExists = await this.fileAdapter.doesFileExist(completeFilePath);

        if (!fileExists) {
            this.logger.logAndThrow(`File does not exist: ${completeFilePath}`);
        }

        await this.fileAdapter.openFile(completeFilePath);
    }

    private async parseVariables(filePath: string): Promise<void> {
        const fileContents = await this.fileAdapter.readFileContents(filePath);
        const updatedFileContent = fileContents.replace(this.variableDeclarationRegex, (value: string, _: any) => {
            const variable = this.variableBuilder.fromString(value).build();
            return this.variableParserFactory.getVariableParser(variable).tryParse(value);
        });

        await this.fileAdapter.writeFileContents(filePath, updatedFileContent);
    }
}