import { format } from "date-fns";
import * as path from "path";
import { WeeklyNoteFileNameBuilder } from "src/domain/builders/WeeklyNoteFileNameBuilder";
import { SettingsRepository } from "src/domain/repositories/SettingsRepository";

export class SettingsWeeklyNoteFileNameBuilder implements WeeklyNoteFileNameBuilder {
    constructor(
        private readonly settingsRepository: SettingsRepository
    ) { }

    async getName(date: Date): Promise<string> {
        const settings = await this.settingsRepository.getSettings();
        const name = format(date, settings.weeklyNoteNameTemplate);

        return name.appendMarkdownExtension();
    }

    async getFullPath(date: Date): Promise<string> {
        const settings = await this.settingsRepository.getSettings();
        const fileName = await this.getName(date);
        return path.join(settings.weeklyNoteFolder, fileName);
    }
}