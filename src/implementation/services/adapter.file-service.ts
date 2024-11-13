import { FileService } from "src/domain/services/file.service";
import {FileAdapter} from "src/domain/adapters/file.adapter";

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
}