import {SettingsRepository} from 'src/infrastructure/contracts/settings-repository';
import {DEFAULT_DISPLAY_NOTES_SETTINGS, DisplayNotesSettings} from 'src/domain/settings/display-notes.settings';
import {SettingsAdapter} from 'src/infrastructure/adapters/settings.adapter';
import {DEFAULT_PLUGIN_SETTINGS} from 'src/domain/settings/plugin.settings';

export class DisplayNotesSettingsRepository implements SettingsRepository<DisplayNotesSettings> {
    constructor(
        private readonly adapter: SettingsAdapter
    ) {

    }

    public async store(settings: DisplayNotesSettings): Promise<void> {
        const storedSettings = await this.adapter.getSettings(DEFAULT_PLUGIN_SETTINGS);
        const allSettings = { ...storedSettings, notesSettings: settings };
        await this.adapter.storeSettings(allSettings);
    }

    public async get(): Promise<DisplayNotesSettings> {
        const allSettings = await this.adapter.getSettings(DEFAULT_PLUGIN_SETTINGS);
        return { ...DEFAULT_DISPLAY_NOTES_SETTINGS, ...allSettings.notesSettings };
    }
}