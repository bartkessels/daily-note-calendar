import {SettingsRepository} from 'src/domain/repositories/settings.repository';
import {DailyNoteSettings, DEFAULT_SETTINGS, Settings} from 'src/domain/models/settings';
import {SettingsAdapter} from 'src/domain/adapters/settings.adapter';

export class DailyNoteSettingsRepository implements SettingsRepository<DailyNoteSettings> {
    constructor(
        private readonly settingsAdapter: SettingsAdapter
    ) {

    }

    public async getSettings(): Promise<DailyNoteSettings> {
        const settings = await this.settingsAdapter.getSettings(DEFAULT_SETTINGS);

        // TODO: Remove this logic in the upcoming release
        return this.getFromLegacySettings(settings);
        return settings.dailyNotes;
    }

    public async storeSettings(settings: DailyNoteSettings): Promise<void> {
        const storedSettings = await this.settingsAdapter.getSettings(DEFAULT_SETTINGS);

        await this.settingsAdapter.storeSettings({
            ...storedSettings,
            dailyNotes: settings
        });
    }

    private getFromLegacySettings(settings: Settings): DailyNoteSettings {
        const legacyNameTemplate = settings.dailyNoteNameTemplate;
        const legacyTemplateFile = settings.dailyNoteTemplateFile;
        const legacyFolder = settings.dailyNotesFolder;

        let nameTemplate = settings.dailyNotes.nameTemplate;
        let templateFile = settings.dailyNotes.templateFile;
        let folder = settings.dailyNotes.folder;

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