import {App, PluginSettingTab, Setting} from 'obsidian';
import {FileSuggest} from 'src/presentation/obsidian/file-suggest';
import {DateParser} from 'src/infrastructure/contracts/date-parser';
import {PluginSettings} from 'src/domain/settings/plugin.settings';

export abstract class SettingsView {
    private readonly today: Date;
    protected abstract title: string;
    protected abstract description: string;

    protected constructor(
        protected readonly settingsTab: PluginSettingTab,
        private readonly onSettingsChange: () => void
    ) {
        this.today = new Date();
    }

    protected get app(): App {
        return this.settingsTab.app;
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

    protected addBooleanSetting(model: SettingUiModel<boolean>, onChange: (value: boolean) => Promise<void>): void {
        new Setting(this.settingsTab.containerEl)
            .setName(model.name)
            .setDesc(model.description)
            .addToggle(component => component
                .setValue(model.value)
                .onChange((value) => onChange(value).then(this.onSettingsChange))
            );
    }

    protected addTextSetting(model: SettingUiModel<string>, onChange: (value: string) => Promise<void>): void {
        new Setting(this.settingsTab.containerEl)
            .setName(model.name)
            .setDesc(model.description)
            .addText(component => component
                .setPlaceholder(model.placeholder)
                .setValue(model.value)
                .onChange((value) => onChange(value).then(this.onSettingsChange))
            );
    }

    protected addTextSettingWithFileSuggest(model: SettingUiModel<string>, onChange: (value: string) => Promise<void>): void {
        new Setting(this.settingsTab.containerEl)
            .setName(model.name)
            .setDesc(model.description)
            .addText(component => {
                component
                    .setPlaceholder(model.placeholder)
                    .setValue(model.value)
                    .onChange((value) => onChange(value).then(this.onSettingsChange));

                new FileSuggest(
                    this.app,
                    component.inputEl,
                    (file) => {
                        const pathWithoutExt = file.path.replace(/\.md$/, '');
                        component.setValue(pathWithoutExt);
                        onChange(pathWithoutExt).then(this.onSettingsChange);
                    }
                );
            });
    }

    protected addDropdownSetting(
        name: string,
        description: string,
        options: Map<string, string>,
        activeOption: string,
        onChange: (value: string) => Promise<void>
    ): void {
        new Setting(this.settingsTab.containerEl)
            .setName(name)
            .setDesc(description)
            .addDropdown(component => component
                .addOptions(Object.fromEntries(options))
                .setValue(activeOption)
                .onChange((value) => onChange(value).then(this.onSettingsChange))
            );
    }

    protected addDateParseSetting(model: SettingUiModel<string>, dateParser: DateParser, onChange: (value: string) => Promise<void>): void {
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
                .onChange(async (value: string) => {
                    exampleElement.setText(dateParser.fromDate(this.today, value));
                    onChange(value).then(this.onSettingsChange);
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