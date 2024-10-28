import { FileService } from "src/domain/services/file.service";
import {FileAdapter} from "src/domain/adapters/file.adapter";

export class AdapterFileService implements FileService {
    constructor(
        private readonly fileAdapter: FileAdapter
    ) {

    }

    public async tryOpenFile(filePath: string, templateFilePath: string): Promise<void> {
        const fileExists = await this.fileAdapter.doesFileExist(filePath);
        const templateFileExists = await this.fileAdapter.doesFileExist(templateFilePath);

        if (!templateFileExists) {
            throw Error(`Template file does not exist: ${templateFilePath}`);
        } else if (!fileExists) {
            await this.fileAdapter.createFileFromTemplate(filePath, templateFilePath);
        }

        await this.fileAdapter.openFile(filePath);
    }
}