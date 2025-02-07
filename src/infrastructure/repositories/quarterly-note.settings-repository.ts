import {SettingsRepository} from 'src/infrastructure/contracts/settings-repository';
import {SettingsAdapter} from 'src/infrastructure/adapters/settings.adapter';
import {DEFAULT_PLUGIN_SETTINGS} from 'src/domain/settings/plugin.settings';
import {DEFAULT_QUARTERLY_NOTE_SETTINGS, PeriodNoteSettings} from 'src/domain/settings/period-note.settings';

export class QuarterlyNoteSettingsRepository implements SettingsRepository<PeriodNoteSettings> {
    constructor(
        private readonly adapter: SettingsAdapter
    ) {

    }

    public async store(settings: PeriodNoteSettings): Promise<void> {
        const allSettings = { ...DEFAULT_PLUGIN_SETTINGS, quarterlyNotes: settings };
        await this.adapter.storeSettings(allSettings);
    }

    public async get(): Promise<PeriodNoteSettings> {
        const allSettings = await this.adapter.getSettings(DEFAULT_PLUGIN_SETTINGS);
        return { ...DEFAULT_QUARTERLY_NOTE_SETTINGS, ...allSettings.quarterlyNotes };
    }
}