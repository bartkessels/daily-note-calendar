import {SettingsRepository} from 'src/domain/repositories/settings.repository';
import {DEFAULT_GENERAL_SETTINGS, GeneralSettings} from 'src/domain/models/settings/general.settings';
import {SettingsAdapter} from 'src/domain/adapters/settings.adapter';
import {DEFAULT_DAILY_NOTE_CALENDAR_SETTINGS} from 'src/domain/models/settings/daily-note-calendar.settings';

export class GeneralSettingsRepository implements SettingsRepository<GeneralSettings> {
    constructor(
        private readonly settingsAdapter: SettingsAdapter
    ) {

    }

    public async getSettings(): Promise<GeneralSettings> {
        const storedSettings = await this.settingsAdapter.getSettings(DEFAULT_DAILY_NOTE_CALENDAR_SETTINGS);
        return {...DEFAULT_GENERAL_SETTINGS, ...storedSettings.generalSettings };
    }

    public async storeSettings(settings: GeneralSettings): Promise<void> {
        const storedSettings = await this.settingsAdapter.getSettings(DEFAULT_DAILY_NOTE_CALENDAR_SETTINGS);

        await this.settingsAdapter.storeSettings({
            ...storedSettings,
            generalSettings: settings
        });
    }
}