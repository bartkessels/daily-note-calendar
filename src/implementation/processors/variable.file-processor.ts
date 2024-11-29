import {FileAdapter} from 'src/domain/adapters/file.adapter';
import {FileProcessor} from 'src/domain/processors/file.processor';
import {Logger} from 'src/domain/loggers/logger';
import {VariableParser} from 'src/domain/parsers/variable.parser';
import {VariableParserFactory} from 'src/domain/factories/variable-parser.factory';

export class VariableFileProcessor implements FileProcessor {
    private readonly variableDeclarationRegex = /{{.*}}/g;


    constructor(
        private readonly fileAdapter: FileAdapter,
        private readonly variableParserFactory: VariableParserFactory,
        private readonly logger: Logger
    ) {

    }

    public async process(filePath: string): Promise<void> {
        const doesFileExist = await this.fileAdapter.doesFileExist(filePath);
        if (!doesFileExist) {
            this.logger.logAndThrow("File does not exist");
        }

        const file = await this.fileAdapter.readFileContents(filePath);
        const variables = file.match(this.variableDeclarationRegex);

        if (!variables) {
            return;
        }


        const updatedFile = variables.map(v => {
            const variableParser = this.variableParserFactory.getVariableParser(v);
            if (!variableParser) {
                return v;
            }

            // return variableParser.tryParse(v);
        });
    }
}