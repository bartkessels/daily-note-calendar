import { normalizePath, Vault, Workspace } from "obsidian";
import { FileService } from "src/domain/services/file.service";

export class VaultFileService implements FileService {
    constructor(
        private readonly vault: Vault,
        private readonly workspace: Workspace
    ) {

    }

    public async tryOpenFile(filePath: string, templateFilePath: string): Promise<void> {
        const actualFilePath = await this.createFileIfNotExists(filePath, templateFilePath);
        await this.workspace.openLinkText(actualFilePath, '');
    }

    private async createFileIfNotExists(filePath: string, templateFilePath: string): Promise<string> {
        const file = this.vault.getFileByPath(filePath);
        const templateFile = this.vault.getFileByPath(templateFilePath.appendMarkdownExtension());

        if (file || !templateFile) {
            return filePath;
        }

        const newFile = await this.vault.copy(templateFile, filePath);
        return newFile.path;
    }
}