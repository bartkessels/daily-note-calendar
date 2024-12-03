import {VariableParser} from 'src/domain/parsers/variable.parser';
import {VariableType} from 'src/domain/models/variable';

export interface FileService {
    doesFileExist(filePath: string): Promise<boolean>;
    createFileWithTemplate(filePath: string, templateFilePath: string): Promise<void>;
    // tryOpenFileWithTemplate(filePath: string, templateFilePath: string): Promise<void>;
    tryOpenFile(filePath: string): Promise<void>;
}
