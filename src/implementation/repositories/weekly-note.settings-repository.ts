import {SettingsRepository} from 'src/domain/repositories/settings.repository';
import {DEFAULT_SETTINGS, Settings, WeeklyNoteSettings} from 'src/domain/models/settings';
import {SettingsAdapter} from 'src/domain/adapters/settings.adapter';

export class WeeklyNoteSettingsRepository implements SettingsRepository<WeeklyNoteSettings> {
    constructor(
        private readonly settingsAdapter: SettingsAdapter
    ) {

    }

    public async getSettings(): Promise<WeeklyNoteSettings> {
        const settings = await this.settingsAdapter.getSettings(DEFAULT_SETTINGS);
        return this.getFromLegacySettings(settings);
        // return settings.weeklyNotes;
    }

    public async storeSettings(settings: WeeklyNoteSettings): Promise<void> {
        const storedSettings = await this.settingsAdapter.getSettings(DEFAULT_SETTINGS);

        await this.settingsAdapter.storeSettings({
            ...storedSettings,
            weeklyNotes: settings
        });
    }

    private getFromLegacySettings(settings: Settings): WeeklyNoteSettings {
        const legacyNameTemplate = settings.weeklyNoteNameTemplate;
        const legacyTemplateFile = settings.weeklyNoteTemplateFile;
        const legacyFolder = settings.weeklyNoteFolder;

        let nameTemplate = settings.weeklyNotes.nameTemplate;
        let templateFile = settings.weeklyNotes.templateFile;
        let folder = settings.weeklyNotes.folder;

        if (nameTemplate === DEFAULT_SETTINGS.dailyNotes.nameTemplate) {
            nameTemplate = legacyNameTemplate;
        }
        if (templateFile === DEFAULT_SETTINGS.dailyNotes.templateFile) {
            templateFile = legacyTemplateFile;
        }
        if (folder === DEFAULT_SETTINGS.dailyNotes.folder) {
            folder = legacyFolder;
        }

        return {
            nameTemplate,
            templateFile,
            folder
        }
    }
}