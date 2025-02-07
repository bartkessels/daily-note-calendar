import {PluginSettingTab, Setting} from 'obsidian';
import {DateParser} from 'src-old/domain/parsers/date.parser';

export abstract class SettingItems {
    private readonly today: Date;

    protected constructor(
        protected readonly settingsTab: PluginSettingTab,
        protected readonly dateParser: DateParser
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

    protected addDateParseSetting(
        name: string,
        description: string,
        placeholder: string,
        value: string,
        onChange: (value: string) => void
    ): void {
        const exampleElement = document.createElement('span');
        exampleElement.className = 'dnc-setting-example';
        exampleElement.setText(this.dateParser.parse(this.today, value));

        const descriptionElement = new DocumentFragment();
        descriptionElement.appendText(description);
        descriptionElement.append(new DocumentFragment().createEl('br'));
        descriptionElement.append('Format example: ');
        descriptionElement.append(exampleElement);

        new Setting(this.settingsTab.containerEl)
            .setName(name)
            .setDesc(descriptionElement)
            .addText(component => component
                .setPlaceholder(placeholder)
                .setValue(value)
                .onChange((value: string) => {
                    exampleElement.setText(this.dateParser.parse(this.today, value));
                    onChange(value);
                })
            );
    }
}