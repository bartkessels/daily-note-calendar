import { FileNameBuilder } from "src/domain/builders/FileNameBuilder";
import { FileManager } from "src/domain/managers/FileManager";
import { SettingsRepository } from "src/domain/repositories/SettingsRepository";
import { FileService } from "src/domain/services/FileService";

export class RepositoryFileManager implements FileManager {
    constructor(
        private readonly settingsRepository: SettingsRepository,
        private readonly fileNameBuilder: FileNameBuilder<Date>,
        private readonly fileService: FileService
    ) {

    }

    public async tryOpenDailyNote(date?: Date): Promise<void> {
        if (!date) {
            return;
        }

        const settings = await this.settingsRepository.getSettings();
        const filePath = this.fileNameBuilder
            .withNameTemplate(settings.dailyNoteNameTemplate)
            .withValue(date)
            .withPath(settings.dailyNotesFolder)
            .build();

        return this.fileService.tryOpenFile(filePath, settings.dailyNoteTemplateFile);
    }
    
    public async tryOpenWeeklyNote(date: Date): Promise<void> {
        if (!date) {
            return;
        }

        const settings = await this.settingsRepository.getSettings();
        const fileName = this.fileNameBuilder
            .withNameTemplate(settings.weeklyNoteNameTemplate)
            .withValue(date)
            .withPath(settings.weeklyNoteFolder)
            .build();

        return this.fileService.tryOpenFile(fileName, settings.weeklyNoteTemplateFile);
    }
    
}