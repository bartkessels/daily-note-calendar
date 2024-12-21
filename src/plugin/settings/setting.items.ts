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

    protected addDateParseSetting(
        name: string,
        description: string,
        placeholder: string,
        value: string,
        onChange: (value: string) => void
    ): void {
        new Setting(this.settingsTab.containerEl)
            .setName(name)
            .setDesc(description)
            .addText(component => component
                .setPlaceholder(placeholder)
                .setValue(value)
                .onChange(onChange)
            );
    }
}