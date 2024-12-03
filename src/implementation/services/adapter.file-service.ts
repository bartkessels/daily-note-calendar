import {FileService} from 'src/domain/services/file.service';
import {FileAdapter} from 'src/domain/adapters/file.adapter';
import {Logger} from 'src/domain/loggers/logger';

export class AdapterFileService implements FileService {
    constructor(
        private readonly fileAdapter: FileAdapter,
        private readonly logger: Logger
    ) {

    }

    public async doesFileExist(filePath: string): Promise<boolean> {
        const completeFilePath = filePath.appendMarkdownExtension()
        return await this.fileAdapter.doesFileExist(completeFilePath);
    }

    public async createFileWithTemplate(filePath: string, templateFilePath: string): Promise<void> {
        const completeFilePath = filePath.appendMarkdownExtension()
        const completeTemplateFilePath = templateFilePath.appendMarkdownExtension()

        const fileExists = await this.doesFileExist(completeFilePath);
        const templateFileExists = await this.fileAdapter.doesFileExist(completeTemplateFilePath);

        if (!templateFileExists) {
            this.logger.logAndThrow(`Template file does not exist: ${completeTemplateFilePath}`);
        } else if (!fileExists) {
            await this.fileAdapter.createFileFromTemplate(completeFilePath, completeTemplateFilePath);
        }
    }

    public async tryOpenFile(filePath: string): Promise<void> {
        const completeFilePath = filePath.appendMarkdownExtension()

        const fileExists = await this.doesFileExist(completeFilePath);

        if (!fileExists) {
            this.logger.logAndThrow(`File does not exist: ${completeFilePath}`);
        }

        await this.fileAdapter.openFile(completeFilePath);
    }
}