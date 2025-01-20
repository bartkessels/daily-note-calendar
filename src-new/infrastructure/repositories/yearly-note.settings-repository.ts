import {SettingsRepository} from 'src-new/infrastructure/contracts/settings-repository';
import {SettingsAdapter} from 'src-new/infrastructure/adapters/settings.adapter';
import {DEFAULT_PLUGIN_SETTINGS} from 'src-new/domain/settings/plugin.settings';
import {DEFAULT_YEARLY_NOTE_SETTINGS, YearlyNoteSettings} from 'src-new/domain/settings/yearly-note.settings';

export class YearlyNoteSettingsRepository implements SettingsRepository<YearlyNoteSettings> {
    constructor(
        private readonly adapter: SettingsAdapter
    ) {

    }

    public async store(settings: YearlyNoteSettings): Promise<void> {
        const allSettings = { ...DEFAULT_PLUGIN_SETTINGS, yearlyNotes: settings };
        await this.adapter.storeSettings(allSettings);
    }

    public async get(): Promise<YearlyNoteSettings> {
        const allSettings = await this.adapter.getSettings(DEFAULT_PLUGIN_SETTINGS);
        return { ...DEFAULT_YEARLY_NOTE_SETTINGS, ...allSettings.yearlyNotes };
    }
}