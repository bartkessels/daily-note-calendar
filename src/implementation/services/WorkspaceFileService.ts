import { normalizePath, Vault, Workspace } from "obsidian";
import { FileService } from "src/domain/services/FileService";

export class VaultFileService implements FileService {
    constructor(
        private readonly vault: Vault,
        private readonly workspace: Workspace
    ) {

    }

    public async tryOpenFile(filePath: string, templateFilePath: string): Promise<void> {
        const actualFilePath = await this.createFileIfNotExists(filePath, templateFilePath);
        this.workspace.openLinkText(actualFilePath, '');
    }

    private async createFileIfNotExists(filePath: string, templateFilePath: string): Promise<string> {
        const file = this.vault.getFileByPath(filePath);
        const templateFile = this.vault.getFileByPath(templateFilePath.appendMarkdownExtension());

        console.log(file);
        console.log(templateFile);

        if (file || !templateFile) {
            return filePath;
        }

        const newFile = await this.vault.copy(templateFile, filePath);
        console.log(newFile);
        return newFile.path;
    }
}