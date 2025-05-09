import {SettingsRepository} from 'src/infrastructure/contracts/settings-repository';
import {SettingsAdapter} from 'src/infrastructure/adapters/settings.adapter';
import {DEFAULT_PLUGIN_SETTINGS} from 'src/domain/settings/plugin.settings';
import {DEFAULT_YEARLY_NOTE_SETTINGS, PeriodNoteSettings} from 'src/domain/settings/period-note.settings';

export class YearlyNoteSettingsRepository implements SettingsRepository<PeriodNoteSettings> {
    constructor(
        private readonly adapter: SettingsAdapter
    ) {

    }

    public async store(settings: PeriodNoteSettings): Promise<void> {
        const storedSettings = await this.adapter.getSettings(DEFAULT_PLUGIN_SETTINGS);
        const allSettings = { ...storedSettings, yearlyNotes: settings };
        await this.adapter.storeSettings(allSettings);
    }

    public async get(): Promise<PeriodNoteSettings> {
        const allSettings = await this.adapter.getSettings(DEFAULT_PLUGIN_SETTINGS);
        return { ...DEFAULT_YEARLY_NOTE_SETTINGS, ...allSettings.yearlyNotes };
    }
}