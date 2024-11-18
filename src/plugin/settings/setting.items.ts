import {PluginSettingTab, Setting} from 'obsidian';

export abstract class SettingItems {
    protected constructor(
        protected readonly settingsTab: PluginSettingTab
    ) {

    }

    public async displaySettings(displaySeparator: boolean = true): Promise<void> {
        await this.registerSettings();

        if (displaySeparator) {
            this.settingsTab.containerEl.createEl('hr');
        }
    }

    protected abstract registerSettings(): Promise<void>;

    protected addHeading(title: string, description: string) {
        new Setting(this.settingsTab.containerEl)
            .setHeading()
            .setName(title)
            .setDesc(description);
    }
}