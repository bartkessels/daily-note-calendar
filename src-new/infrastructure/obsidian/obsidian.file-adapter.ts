import {normalizePath, Plugin, TFile, TFolder} from 'obsidian';
import {FileAdapter} from 'src-new/infrastructure/adapters/file.adapter';

export class ObsidianFileAdapter implements FileAdapter {
    constructor(
        private readonly plugin: Plugin
    ) {

    }

    public async exists(path: string): Promise<boolean> {
        const normalizedPath = this.normalizePath(path);
        return await this.plugin.app.vault.adapter.exists(normalizedPath, true);
    }

    public async create(path: string, templateFilePath?: string | undefined): Promise<string> {
        const normalizedFilePath = this.normalizePath(path);
        const normalizedTemplateFilePath = this.normalizePath(templateFilePath ?? '');
        const templateFileContents = await this.readContents(normalizedTemplateFilePath);

        await this.createFolder(normalizedFilePath);
        await this.plugin.app.vault.create(normalizedFilePath, templateFileContents);

        return normalizedFilePath;
    }

    public async readContents(path: string): Promise<string> {
        const normalizedPath = this.normalizePath(path);
        const file = this.plugin.app.vault.getAbstractFileByPath(normalizedPath);

        if (file instanceof TFile) {
            return await this.plugin.app.vault.read(file);
        }

        return '';
    }

    public async writeContents(path: string, contents: string): Promise<void> {
        const normalizedPath = this.normalizePath(path);
        const file = this.plugin.app.vault.getAbstractFileByPath(normalizedPath);

        if (file instanceof TFile) {
            await this.plugin.app.vault.modify(file, contents);
        }
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

    private async createFolder(filePath: string): Promise<void> {
        const folder = filePath.split('/').slice(0, -1).join('/');
        const file = this.plugin.app.vault.getAbstractFileByPath(folder);

        if (!file && file !instanceof TFolder) {
            await this.plugin.app.vault.createFolder(folder);
        }
    }

    private normalizePath(filePath: string): string {
        return normalizePath(filePath).appendMarkdownExtension().toString();
    }
}