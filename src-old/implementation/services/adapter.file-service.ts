import {FileService} from 'src-old/domain/services/file.service';
import {FileAdapter} from 'src-old/domain/adapters/file.adapter';
import {Logger} from 'src-old/domain/loggers/logger';

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
        const templateFileExists = await this.doesFileExist(completeTemplateFilePath);

        if (fileExists) {
            this.logger.logAndThrow(`File already exists: ${completeFilePath}`);
        } else if (!templateFileExists) {
            this.logger.logAndThrow(`Template file does not exist: ${completeTemplateFilePath}`);
        }

        try {
            await this.fileAdapter.createFileFromTemplate(completeFilePath, completeTemplateFilePath);
        } catch (_) {
            this.logger.logAndThrow(`Error creating file: ${completeFilePath}`);
        }
    }

    public async tryOpenFile(filePath: string): Promise<void> {
        const completeFilePath = filePath.appendMarkdownExtension()
        const fileExists = await this.doesFileExist(completeFilePath);

        if (!fileExists) {
            this.logger.logAndThrow(`File does not exist: ${completeFilePath}`);
        }

        try {
            await this.fileAdapter.openFile(completeFilePath);
        } catch (_) {
            this.logger.logAndThrow(`Error opening file: ${completeFilePath}`);
        }
    }

    public async tryDeleteFile(filePath: string): Promise<void> {
        const completeFilePath = filePath.appendMarkdownExtension()
        const fileExists = await this.doesFileExist(completeFilePath);

        if (!fileExists) {
            this.logger.logAndThrow(`File does not exist: ${completeFilePath}`);
        }

        try {
            await this.fileAdapter.deleteFile(completeFilePath);
        } catch (_) {
            this.logger.logAndThrow(`Error deleting file: ${completeFilePath}`);
        }
    }
}