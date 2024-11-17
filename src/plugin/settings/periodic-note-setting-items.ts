import {PluginSettingTab, Setting} from 'obsidian';
import {PeriodicNoteSettingUiModel} from 'src/plugin/model/periodic-note-setting-ui.model';
import {DateParser} from 'src/domain/parsers/date.parser';

export abstract class PeriodicNoteSettingItems {
    private readonly today: Date;

    protected constructor(
        private readonly settingsTab: PluginSettingTab,
        private readonly dateParser: DateParser
    ) {
        this.today = new Date();
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

    protected addDateParseSetting(setting: PeriodicNoteSettingUiModel, onChange: (value: string) => void) {
        const exampleElement = document.createElement('span');
        exampleElement.className = 'setting-example';
        exampleElement.setText(this.tryParseToday(setting.value));

        const description = new DocumentFragment();
        description.appendText(`${setting.description} `);
        description.append(exampleElement);

        new Setting(this.settingsTab.containerEl)
            .setName(setting.name)
            .setDesc(description)
            .addText(component => component
                .setPlaceholder(setting.placeholder)
                .setValue(setting.value)
                .onChange((value: string) => {
                    exampleElement.setText(this.tryParseToday(value));
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

    private tryParseToday(template: string): string {
        try {
            return this.dateParser.parse(new Date(), template);
        } catch {
            return template;
        }
    }
}