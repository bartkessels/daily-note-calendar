import {PluginSettingTab, Setting} from 'obsidian';
import {DateParser} from 'src/infrastructure/contracts/date-parser';

export abstract class SettingsView {
    private readonly today: Date;
    protected abstract title: string;
    protected abstract description: string;

    protected constructor(
        protected readonly settingsTab: PluginSettingTab
    ) {
        this.today = new Date();
    }

    protected abstract addSettings(): Promise<void>;

    public async displaySettings(): Promise<void> {
        this.addHeading(this.title, this.description);
        await this.addSettings();
    }

    protected addHeading(title: string, description: string): void {
        new Setting(this.settingsTab.containerEl)
            .setHeading()
            .setName(title)
            .setDesc(description);
    }

    protected addBooleanSetting(model: SettingUiModel<boolean>, onChange: (value: boolean) => void): void {
        new Setting(this.settingsTab.containerEl)
            .setName(model.name)
            .setDesc(model.description)
            .addToggle(component => component
                .setValue(model.value)
                .onChange(onChange)
            );
    }

    protected addTextSetting(model: SettingUiModel<string>, onChange: (value: string) => void): void {
        new Setting(this.settingsTab.containerEl)
            .setName(model.name)
            .setDesc(model.description)
            .addText(component => component
                .setPlaceholder(model.placeholder)
                .setValue(model.value)
                .onChange(onChange)
            );
    }

    protected addDateParseSetting(model: SettingUiModel<string>, dateParser: DateParser, onChange: (value: string) => void): void {
        const exampleElement = document.createElement('span');
        exampleElement.className = 'dnc-setting-example';
        exampleElement.setText(dateParser.fromDate(this.today, model.value));

        const descriptionElement = new DocumentFragment();
        descriptionElement.appendText(model.description);
        descriptionElement.append(new DocumentFragment().createEl('br'));
        descriptionElement.append('Format example: ');
        descriptionElement.append(exampleElement);

        new Setting(this.settingsTab.containerEl)
            .setName(model.name)
            .setDesc(descriptionElement)
            .addText(component => component
                .setPlaceholder(model.placeholder)
                .setValue(model.value)
                .onChange((value: string) => {
                    exampleElement.setText(dateParser.fromDate(this.today, value));
                    onChange(value);
                })
            );
    }
}

export interface SettingUiModel<T> {
    name: string;
    description: string;
    placeholder: string;
    value: T;
}