import {PluginSettingTab, Setting} from 'obsidian';
import {SettingUiModel} from 'src/plugin/model/setting.ui-model';

export abstract class SettingItems {
    protected constructor(
        private readonly settingsTab: PluginSettingTab
    ) {

    }

    public abstract registerSettings(): Promise<void>;

    protected addHeading(title: string, description: string) {
        new Setting(this.settingsTab.containerEl)
            .setHeading()
            .setName(title)
            .setDesc(description);
    }

    protected addSetting(setting: SettingUiModel, onChange: (value: string) => void) {
        new Setting(this.settingsTab.containerEl)
            .setName(setting.name)
            .setDesc(setting.description)
            .addText(component => component
                .setPlaceholder(setting.placeholder)
                .setValue(setting.value)
                .onChange(onChange)
            );
    }
}