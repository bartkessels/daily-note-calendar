import {SettingsRepository} from 'src-new/infrastructure/contracts/settings-repository';
import {SettingsAdapter} from 'src-new/infrastructure/adapters/settings-adapter';
import {DEFAULT_PLUGIN_SETTINGS} from 'src-new/domain/settings/plugin.settings';
import {DEFAULT_WEEKLY_NOTE_SETTINGS, WeeklyNoteSettings} from 'src-new/domain/settings/weekly-note.settings';

export class WeeklyNoteSettingsRepository implements SettingsRepository<WeeklyNoteSettings> {
    constructor(
        private readonly adapter: SettingsAdapter
    ) {

    }

    public async store(settings: WeeklyNoteSettings): Promise<void> {
        const allSettings = { ...DEFAULT_PLUGIN_SETTINGS, weeklyNote: settings };
        await this.adapter.storeSettings(allSettings);
    }

    public async get(): Promise<WeeklyNoteSettings> {
        const allSettings = await this.adapter.getSettings(DEFAULT_PLUGIN_SETTINGS);
        return { ...DEFAULT_WEEKLY_NOTE_SETTINGS, ...allSettings.weeklyNotes };
    }
}