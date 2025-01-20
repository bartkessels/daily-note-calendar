import {SettingsRepository} from 'src-new/infrastructure/contracts/settings-repository';
import {SettingsAdapter} from 'src-new/infrastructure/adapters/settings.adapter';
import {DEFAULT_PLUGIN_SETTINGS} from 'src-new/domain/settings/plugin.settings';
import {DEFAULT_MONTHLY_NOTE_SETTINGS, MonthlyNoteSettings} from 'src-new/domain/settings/monthly-note.settings';

export class MonthlyNoteSettingsRepository implements SettingsRepository<MonthlyNoteSettings> {
    constructor(
        private readonly adapter: SettingsAdapter
    ) {

    }

    public async store(settings: MonthlyNoteSettings): Promise<void> {
        const allSettings = { ...DEFAULT_PLUGIN_SETTINGS, monthlyNotes: settings };
        await this.adapter.storeSettings(allSettings);
    }

    public async get(): Promise<MonthlyNoteSettings> {
        const allSettings = await this.adapter.getSettings(DEFAULT_PLUGIN_SETTINGS);
        return { ...DEFAULT_MONTHLY_NOTE_SETTINGS, ...allSettings.monthlyNotes };
    }
}