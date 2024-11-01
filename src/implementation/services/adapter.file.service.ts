import { FileService } from "src/domain/services/file.service";
import {FileAdapter} from "src/domain/adapters/file.adapter";
import {Note} from "src/domain/models/Note";

export class AdapterFileService implements FileService {
    constructor(
        private readonly fileAdapter: FileAdapter
    ) {

    }

    public async tryOpenFile(filePath: string, templateFilePath: string): Promise<void> {
        const completeFilePath = filePath.appendMarkdownExtension()
        const completeTemplateFilePath = templateFilePath.appendMarkdownExtension()

        const fileExists = await this.fileAdapter.doesFileExist(completeFilePath);
        const templateFileExists = await this.fileAdapter.doesFileExist(completeTemplateFilePath);

        if (!templateFileExists) {
            throw Error(`Template file does not exist: ${completeTemplateFilePath}`);
        } else if (!fileExists) {
            await this.fileAdapter.createFileFromTemplate(completeFilePath, completeTemplateFilePath);
        }

        await this.fileAdapter.openFile(completeFilePath);
    }

    public async getNotesCreatedOnDate(date: Date): Promise<Note[]> {
        return await this.fileAdapter.getNotesCreatedOnDate(date);
    }
}