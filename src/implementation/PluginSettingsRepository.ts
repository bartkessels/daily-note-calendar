import { Plugin } from "obsidian";
import { DEFAULT_SETTINGS, type Settings } from "src/domain/models/Settings";
import type { SettingsRepository } from "src/domain/repositories/SettingsRepository";

export class PluginSettingsRepository implements SettingsRepository {
    constructor(private readonly plugin: Plugin) {

    }

    async getSettings(): Promise<Settings> {
        var settings = await this.plugin.loadData();
        return { ...DEFAULT_SETTINGS, ...settings };
    }

    async storeSettings(settings: Settings): Promise<void> {
        await this.plugin.saveData(settings);
    }
}