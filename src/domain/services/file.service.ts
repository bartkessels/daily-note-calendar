export interface FileService {
    tryOpenFile(filePath: string, templateFilePath: string): Promise<void>;
}
