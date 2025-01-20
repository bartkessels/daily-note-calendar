import {SettingsRepository} from 'src-new/infrastructure/contracts/settings-repository';
import {DEFAULT_DISPLAY_NOTES_SETTINGS, DisplayNotesSettings} from 'src-new/domain/settings/display-notes.settings';
import {SettingsAdapter} from 'src-new/infrastructure/adapters/settings.adapter';
import {DEFAULT_PLUGIN_SETTINGS} from 'src-new/domain/settings/plugin.settings';

export class DisplayNotesSettingsRepository implements SettingsRepository<DisplayNotesSettings> {
    constructor(
        private readonly adapter: SettingsAdapter
    ) {

    }

    public async store(settings: DisplayNotesSettings): Promise<void> {
        const allSettings = { ...DEFAULT_PLUGIN_SETTINGS, notesSettings: settings };
        await this.adapter.storeSettings(allSettings);
    }

    public async get(): Promise<DisplayNotesSettings> {
        const allSettings = await this.adapter.getSettings(DEFAULT_PLUGIN_SETTINGS);
        return { ...DEFAULT_DISPLAY_NOTES_SETTINGS, ...allSettings.notesSettings };
    }
}