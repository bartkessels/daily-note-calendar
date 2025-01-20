import {SettingsRepository} from 'src-new/infrastructure/contracts/settings-repository';
import {SettingsAdapter} from 'src-new/infrastructure/adapters/settings.adapter';
import {DEFAULT_PLUGIN_SETTINGS} from 'src-new/domain/settings/plugin.settings';
import {DEFAULT_QUARTERLY_NOTE_SETTINGS, QuarterlyNoteSettings} from 'src-new/domain/settings/quarterly-note.settings';

export class QuarterlyNoteSettingsRepository implements SettingsRepository<QuarterlyNoteSettings> {
    constructor(
        private readonly adapter: SettingsAdapter
    ) {

    }

    public async store(settings: QuarterlyNoteSettings): Promise<void> {
        const allSettings = { ...DEFAULT_PLUGIN_SETTINGS, quarterlyNotes: settings };
        await this.adapter.storeSettings(allSettings);
    }

    public async get(): Promise<QuarterlyNoteSettings> {
        const allSettings = await this.adapter.getSettings(DEFAULT_PLUGIN_SETTINGS);
        return { ...DEFAULT_QUARTERLY_NOTE_SETTINGS, ...allSettings.quarterlyNotes };
    }
}