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

    protected addDateParseSetting(setting: PeriodicNoteSettingUiModel, onChange: (value: string) => void) {
        const exampleElement = document.createElement('span');
        exampleElement.className = 'setting-example';
        exampleElement.setText(this.dateParser.parse(this.today, setting.value));

        const description = new DocumentFragment();
        description.appendText(setting.description);
        description.append(new DocumentFragment().createEl('br'));
        description.append('Format example: ')
        description.append(exampleElement);

        new Setting(this.settingsTab.containerEl)
            .setName(setting.name)
            .setDesc(description)
            .addText(component => component
                .setPlaceholder(setting.placeholder)
                .setValue(setting.value)
                .onChange((value: string) => {
                    exampleElement.setText(this.dateParser.parse(this.today, value));
                    onChange(value);
                })
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