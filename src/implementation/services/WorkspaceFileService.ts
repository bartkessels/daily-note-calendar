import { normalizePath, Vault, Workspace } from "obsidian";
import { DailyNoteFileNameBuilder } from "src/domain/builders/DailyNoteFileNameBuilder";
import { WeeklyNoteFileNameBuilder } from "src/domain/builders/WeeklyNoteFileNameBuilder";
import { SettingsRepository } from "src/domain/repositories/SettingsRepository";
import { FileService } from "src/domain/services/FileService";

export class VaultFileService implements FileService {
    constructor(
        private readonly vault: Vault,
        private readonly workspace: Workspace,
        private readonly settingsRepository: SettingsRepository,
        private readonly dailyNoteNameBuilder: DailyNoteFileNameBuilder,
        private readonly weeklyNoteNameBuilder: WeeklyNoteFileNameBuilder
    ) {}

    async tryOpenDailyNote(date: Date): Promise<void> {
        const settings = await this.settingsRepository.getSettings();

        const filePath = await this.dailyNoteNameBuilder.getFullPath(date);
        const normalizedFilePath = normalizePath(filePath);
        const normalizedTemplatePath = normalizePath(settings.dailyNoteTemplateFile);

        await this.tryOpenFile(normalizedFilePath, normalizedTemplatePath);
    }

    async tryOpenWeeklyNote(date: Date): Promise<void> {
        const settings = await this.settingsRepository.getSettings();

        const filePath = await this.weeklyNoteNameBuilder.getFullPath(date);
        const normalizedFilePath = normalizePath(filePath);
        const normalizedTemplatePath = normalizePath(settings.weeklyNoteTemplateFile);

        await this.tryOpenFile(normalizedFilePath, normalizedTemplatePath);
    }

    private async tryOpenFile(filePath: string, templateFilePath: string): Promise<void> {
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