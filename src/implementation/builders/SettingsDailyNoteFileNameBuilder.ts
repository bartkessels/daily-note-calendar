import { format } from "date-fns";
import * as path from "path";
import { DailyNoteFileNameBuilder } from "src/domain/builders/DailyNoteFileNameBuilder";
import { SettingsRepository } from "src/domain/repositories/SettingsRepository";

export class SettingsDailyNoteFileNameBuilder implements DailyNoteFileNameBuilder {
    constructor(
        private readonly settingsRepository: SettingsRepository
    ) { }

    async getName(date: Date): Promise<string> {
        const settings = await this.settingsRepository.getSettings();
        const name = format(date, settings.dailyNoteNameTemplate);

        return name.appendMarkdownExtension();
    }

    async getFullPath(date: Date): Promise<string> {
        const settings = await this.settingsRepository.getSettings();
        const fileName = await this.getName(date);
        return path.join(settings.dailyNotesFolder, fileName);
    }
}