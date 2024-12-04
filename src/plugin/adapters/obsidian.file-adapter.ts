import {FileAdapter} from 'src/domain/adapters/file.adapter';
import {normalizePath, TFolder, Vault, Workspace} from 'obsidian';

export class ObsidianFileAdapter implements FileAdapter {
    constructor(
        private readonly vault: Vault,
        private readonly workspace: Workspace
    ) {

    }

    public async doesFileExist(filePath: string): Promise<boolean> {
        const normalizedPath = this.normalizePath(filePath);
        return await this.vault.adapter.exists(normalizedPath, false);
    }

    public async createFileFromTemplate(filePath: string, templateFilePath: string): Promise<string> {
        const normalizedFilePath = this.normalizePath(filePath);
        const normalizedTemplateFilePath = this.normalizePath(templateFilePath);

        const templateFile = this.vault.getFileByPath(normalizedTemplateFilePath);

        if (!templateFile) {
            throw new Error(`Template file does not exist: ${normalizedTemplateFilePath}.`);
        }

        await this.createFolder(normalizedFilePath);
        const newFile = await this.vault.copy(templateFile, normalizedFilePath);
        return newFile.path;
    }

    public async openFile(filePath: string): Promise<void> {
        const normalizedPath = this.normalizePath(filePath);
        const file = this.vault.getFileByPath(normalizedPath);

        if (!file) {
            throw new Error(`File does not exist: ${normalizedPath}.`);
        }

        await this.workspace.getLeaf().openFile(file, { active: true });
    }

    public async readFileContents(filePath: string): Promise<string> {
        const normalizedPath = this.normalizePath(filePath);
        const file = this.vault.getAbstractFileByPath(normalizedPath);

        if (!file) {
            throw new Error(`File does not exist: ${normalizedPath}.`);
        } else if (file instanceof TFolder) {
            throw new Error(`Path is a folder: ${normalizedPath}.`);
        }

        return await this.vault.adapter.read(normalizedPath);
    }

    public async writeFileContents(filePath: string, contents: string): Promise<void> {
        const normalizedPath = this.normalizePath(filePath);
        const file = this.vault.getAbstractFileByPath(normalizedPath);

        if (!file) {
            throw new Error(`File does not exist: ${normalizedPath}.`);
        } else if (file instanceof TFolder) {
            throw new Error(`Path is a folder: ${normalizedPath}.`);
        }

        await this.vault.adapter.write(normalizedPath, contents);
    }

    private async createFolder(filePath: string): Promise<void> {
        const folder = filePath.split('/').slice(0, -1).join('/');
        const file = this.vault.getAbstractFileByPath(folder);

        if (file && file instanceof TFolder) {
            return;
        }

        await this.vault.createFolder(folder);
    }

    private normalizePath(filePath: string): string {
        return normalizePath(filePath).appendMarkdownExtension().toString();
    }
}