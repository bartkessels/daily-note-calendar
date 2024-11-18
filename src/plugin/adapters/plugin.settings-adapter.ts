import {Plugin} from 'obsidian';
import {SettingsAdapter} from 'src/domain/adapters/settings.adapter';
import {DailyNoteCalendarSettings} from 'src/domain/models/settings/daily-note-calendar.settings';

export class PluginSettingsAdapter implements SettingsAdapter {
    constructor(
        private readonly plugin: Plugin
    ) {

    }

    async getSettings(defaultSettings: DailyNoteCalendarSettings): Promise<DailyNoteCalendarSettings> {
        const settings = await this.plugin.loadData()
        return { ...defaultSettings, ...settings };
    }

    async storeSettings(settings: DailyNoteCalendarSettings): Promise<void> {
        await this.plugin.saveData(settings);
    }
}