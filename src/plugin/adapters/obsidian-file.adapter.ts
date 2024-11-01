import {FileAdapter} from "src/domain/adapters/file.adapter";
import {normalizePath, Vault, Workspace} from "obsidian";
import {Note} from "src/domain/models/Note";

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

    public async getNotesCreatedOnDate(date: Date): Promise<Note[]> {
        const requestedDate = date.setHours(0, 0, 0, 0);
        return this.vault.getFiles().filter(file => {
            const createdDate = new Date(file.stat.ctime).setHours(0, 0, 0, 0);
            return createdDate === requestedDate;
        }).map(file => {
            return <Note>{
                name: file.name,
                createdOn: new Date(file.stat.ctime),
                filePath: file.path
            };
        });
    }

    private normalizePath(filePath: string): string {
        return normalizePath(filePath).appendMarkdownExtension();
    }
}