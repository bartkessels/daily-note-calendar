import {PluginSettingTab, Setting} from 'obsidian';
import {PeriodicNoteSettingUiModel} from 'src/plugin/model/periodic-note-setting-ui.model';
import {DateParser} from 'src/domain/parsers/date.parser';
import {SettingItems} from 'src/plugin/settings/setting.items';

export abstract class PeriodicNoteSettingItems extends SettingItems {
    private readonly today: Date;

    protected constructor(
        readonly settingsTab: PluginSettingTab,
        private readonly dateParser: DateParser
    ) {
        super(settingsTab);
        this.today = new Date();
    }

    protected addPeriodicDateSetting(setting: PeriodicNoteSettingUiModel, onChange: (value: string) => void) {
        this.addDateParseSetting(
            setting.name,
            setting.description,
            setting.placeholder,
            setting.value,
            onChange
        );
    }

    protected addSetting(setting: PeriodicNoteSettingUiModel, onChange: (value: string) => void) {
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