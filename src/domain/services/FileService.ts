export interface FileService {
    tryOpenFile(filePath: String, templateFilePath: String): Promise<void>;
}
