import {SettingsRepository} from 'src-new/infrastructure/contracts/settings-repository';
import {DailyNoteSettings, DEFAULT_DAILY_NOTE_SETTINGS} from 'src-new/domain/settings/daily-note.settings';
import {SettingsAdapter} from 'src-new/infrastructure/adapters/settings.adapter';
import {DEFAULT_PLUGIN_SETTINGS} from 'src-new/domain/settings/plugin.settings';

export class DailyNoteSettingsRepository implements SettingsRepository<DailyNoteSettings> {
    constructor(
        private readonly adapter: SettingsAdapter
    ) {

    }

    public async store(settings: DailyNoteSettings): Promise<void> {
        const allSettings = { ...DEFAULT_PLUGIN_SETTINGS, dailyNotes: settings };
        await this.adapter.storeSettings(allSettings);
    }

    public async get(): Promise<DailyNoteSettings> {
        const allSettings = await this.adapter.getSettings(DEFAULT_PLUGIN_SETTINGS);
        return { ...DEFAULT_DAILY_NOTE_SETTINGS, ...allSettings.dailyNotes };
    }
}