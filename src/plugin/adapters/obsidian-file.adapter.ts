import {FileAdapter} from "src/domain/adapters/file.adapter";
import {normalizePath, Vault, Workspace} from "obsidian";

export class ObsidianFileAdapter implements FileAdapter {
    constructor(
        private readonly vault: Vault,
        private readonly workspace: Workspace
    ) {

    }

    public async doesFileExist(filePath: string): Promise<boolean> {
        const file = this.vault.getFileByPath(filePath);
        return file !== null;
    }

    public async createFileFromTemplate(filePath: string, templateFilePath: string): Promise<string> {
        const templateFile = this.vault.getFileByPath(templateFilePath.appendMarkdownExtension());

        if (!templateFile) {
            throw new Error(`Template file does not exist: ${templateFilePath}.`);
        }

        const newFile = await this.vault.copy(templateFile, normalizePath(filePath));
        return newFile.path;
    }

    public async openFile(filePath: string): Promise<void> {
        await this.workspace.openLinkText(filePath, '');
    }
}