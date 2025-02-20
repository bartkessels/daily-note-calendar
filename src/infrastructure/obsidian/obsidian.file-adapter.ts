import {normalizePath, Plugin, TFile, TFolder} from 'obsidian';
import {FileAdapter} from 'src/infrastructure/adapters/file.adapter';

export class ObsidianFileAdapter implements FileAdapter {
    constructor(
        private readonly plugin: Plugin
    ) {

    }

    public async exists(path: string): Promise<boolean> {
        const normalizedPath = this.normalizePath(path);
        const file = this.plugin.app.vault.getAbstractFileByPath(normalizedPath);

        return file instanceof TFile;
    }

    public async createFileFromTemplate(path: string, templateFilePath: string): Promise<string> {
        const normalizedFilePath = this.normalizePath(path);
        const normalizedTemplateFilePath = this.normalizePath(templateFilePath ?? '');
        const templateFileContents = await this.readContents(normalizedTemplateFilePath);
        const file = await this.plugin.app.vault.create(normalizedFilePath, templateFileContents);

        return file.path;
    }

    public async createFile(path: string): Promise<string> {
        const normalizedPath = this.normalizePath(path);
        const file = await this.plugin.app.vault.create(normalizedPath, '');

        return file.path;
    }

    public async createFolder(folder: string): Promise<void> {
        const file = this.plugin.app.vault.getAbstractFileByPath(folder);

        if (file && file instanceof TFolder) {
            return;
        }

        await this.plugin.app.vault.createFolder(folder);
    }

    public async readContents(path: string): Promise<string> {
        const normalizedPath = this.normalizePath(path);
        const file = this.plugin.app.vault.getAbstractFileByPath(normalizedPath);

        if (file instanceof TFile) {
            return await this.plugin.app.vault.cachedRead(file);
        }

        return '';
    }

    public async writeContents(path: string, contents: string): Promise<void> {
        const normalizedPath = this.normalizePath(path);
        await this.plugin.app.vault.adapter.write(normalizedPath, contents);
    }

    public async open(path: string): Promise<void> {
        const normalizedPath = this.normalizePath(path);
        const file = this.plugin.app.vault.getFileByPath(normalizedPath);

        if (!file) {
            throw new Error(`File does not exist: ${normalizedPath}.`);
        }

        await this.plugin.app.workspace.getLeaf().openFile(file, { active: true });
    }

    public async delete(path: string): Promise<void> {
        const normalizedPath = this.normalizePath(path);
        const file = this.plugin.app.vault.getAbstractFileByPath(normalizedPath);

        if (file instanceof TFile) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (<any>this.plugin.app).fileManager.promptForFileDeletion(file);
        }
    }

    private normalizePath(filePath: string): string {
        return normalizePath(filePath).appendMarkdownExtension().toString();
    }
}