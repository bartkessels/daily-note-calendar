import {SettingsRepository} from 'src/domain/repositories/settings.repository';
import {SettingsAdapter} from 'src/domain/adapters/settings.adapter';
import {WeeklyNotesPeriodicNoteSettings} from 'src/domain/models/settings/weekly-notes.periodic-note-settings';
import {
    DailyNoteCalendarSettings,
    DEFAULT_DAILY_NOTE_CALENDAR_SETTINGS
} from 'src/domain/models/settings/daily-note-calendar.settings';

export class WeeklyNoteSettingsRepository implements SettingsRepository<WeeklyNotesPeriodicNoteSettings> {
    constructor(
        private readonly settingsAdapter: SettingsAdapter
    ) {

    }

    public async getSettings(): Promise<WeeklyNotesPeriodicNoteSettings> {
        const settings = await this.settingsAdapter.getSettings(DEFAULT_DAILY_NOTE_CALENDAR_SETTINGS);

        // TODO: Remove this logic in the upcoming release
        const legacySettings = this.getFromLegacySettings(settings);
        await this.storeSettings(legacySettings);
        return legacySettings;
        return settings.dailyNotes;
    }

    public async storeSettings(settings: WeeklyNotesPeriodicNoteSettings): Promise<void> {
        const storedSettings = await this.settingsAdapter.getSettings(DEFAULT_DAILY_NOTE_CALENDAR_SETTINGS);

        await this.settingsAdapter.storeSettings({
            ...storedSettings,
            weeklyNotes: settings
        });
    }

    private getFromLegacySettings(settings: DailyNoteCalendarSettings): WeeklyNotesPeriodicNoteSettings {
        const legacyNameTemplate = settings.weeklyNoteNameTemplate;
        const legacyTemplateFile = settings.weeklyNoteTemplateFile;
        const legacyFolder = settings.weeklyNoteFolder;

        let nameTemplate = settings.weeklyNotes.nameTemplate;
        let templateFile = settings.weeklyNotes.templateFile;
        let folder = settings.weeklyNotes.folder;

        if (nameTemplate === DEFAULT_DAILY_NOTE_CALENDAR_SETTINGS.weeklyNotes.nameTemplate) {
            nameTemplate = legacyNameTemplate;
        }
        if (templateFile === DEFAULT_DAILY_NOTE_CALENDAR_SETTINGS.weeklyNotes.templateFile) {
            templateFile = legacyTemplateFile;
        }
        if (folder === DEFAULT_DAILY_NOTE_CALENDAR_SETTINGS.weeklyNotes.folder) {
            folder = legacyFolder;
        }

        return {
            nameTemplate,
            templateFile,
            folder
        }
    }
}