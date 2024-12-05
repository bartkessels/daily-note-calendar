export interface FileService {
    doesFileExist(filePath: string): Promise<boolean>;
    createFileWithTemplate(filePath: string, templateFilePath: string): Promise<void>;
    tryOpenFile(filePath: string): Promise<void>;
}
