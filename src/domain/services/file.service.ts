export interface FileService {
    tryOpenFileWithTemplate(filePath: string, templateFilePath: string): Promise<void>;
    tryOpenFile(filePath: string): Promise<void>;
}
