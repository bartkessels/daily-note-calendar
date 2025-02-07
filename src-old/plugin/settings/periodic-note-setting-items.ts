import {PluginSettingTab, Setting} from 'obsidian';
import {PeriodicNoteSettingUiModel} from 'src-old/plugin/model/periodic-note-setting-ui.model';
import {DateParser} from 'src-old/domain/parsers/date.parser';
import {SettingItems} from 'src-old/plugin/settings/setting.items';

export abstract class PeriodicNoteSettingItems extends SettingItems {
    protected constructor(
        readonly settingsTab: PluginSettingTab,
        readonly dateParser: DateParser
    ) {
        super(settingsTab, dateParser);
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