import {VariableParser} from 'src/domain/parsers/variable.parser';
import {VariableType} from 'src/domain/models/variable';

export interface FileService {
    registerVariableParser<T>(type: VariableType, parser: VariableParser<T>): void;
    tryOpenFileWithTemplate(filePath: string, templateFilePath: string): Promise<void>;
    tryOpenFile(filePath: string): Promise<void>;
}
