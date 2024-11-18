import {SettingsRepository} from 'src/domain/repositories/settings.repository';
import {SettingsAdapter} from 'src/domain/adapters/settings.adapter';
import {DailyNotesPeriodicNoteSettings} from 'src/domain/models/settings/daily-notes.periodic-note-settings';
import {
    DailyNoteCalendarSettings,
    DEFAULT_DAILY_NOTE_CALENDAR_SETTINGS
} from 'src/domain/models/settings/daily-note-calendar.settings';

export class DailyNoteSettingsRepository implements SettingsRepository<DailyNotesPeriodicNoteSettings> {
    constructor(
        private readonly settingsAdapter: SettingsAdapter
    ) {

    }

    public async getSettings(): Promise<DailyNotesPeriodicNoteSettings> {
        const settings = await this.settingsAdapter.getSettings(DEFAULT_DAILY_NOTE_CALENDAR_SETTINGS);

        // TODO: Remove this logic in the upcoming release
        const legacySettings = this.getFromLegacySettings(settings);
        await this.storeSettings(legacySettings);
        return legacySettings;
        return settings.dailyNotes;
    }

    public async storeSettings(settings: DailyNotesPeriodicNoteSettings): Promise<void> {
        const storedSettings = await this.settingsAdapter.getSettings(DEFAULT_DAILY_NOTE_CALENDAR_SETTINGS);

        await this.settingsAdapter.storeSettings({
            ...storedSettings,
            dailyNotes: settings
        });
    }

    private getFromLegacySettings(settings: DailyNoteCalendarSettings): DailyNotesPeriodicNoteSettings {
        const legacyNameTemplate = settings.dailyNoteNameTemplate;
        const legacyTemplateFile = settings.dailyNoteTemplateFile;
        const legacyFolder = settings.dailyNotesFolder;

        let nameTemplate = settings.dailyNotes.nameTemplate;
        let templateFile = settings.dailyNotes.templateFile;
        let folder = settings.dailyNotes.folder;

        if (nameTemplate === DEFAULT_DAILY_NOTE_CALENDAR_SETTINGS.dailyNotes.nameTemplate) {
            nameTemplate = legacyNameTemplate;
        }
        if (templateFile === DEFAULT_DAILY_NOTE_CALENDAR_SETTINGS.dailyNotes.templateFile) {
            templateFile = legacyTemplateFile;
        }
        if (folder === DEFAULT_DAILY_NOTE_CALENDAR_SETTINGS.dailyNotes.folder) {
            folder = legacyFolder;
        }

        return {
            nameTemplate,
            templateFile,
            folder
        }
    }
}