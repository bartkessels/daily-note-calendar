import { Plugin, PluginSettingTab, Setting } from "obsidian";
import { SettingsUiModel } from "../model/settings.ui.model";
import { dailyNoteFolderSetting, dailyNoteNameSetting, dailyNoteTemplateFile, weeklyNoteFolderSetting, weeklyNoteNameTemplateSetting, weeklyNoteTemplateFile } from "./settings";
import { SettingsRepository } from "src/domain/repositories/settings.repository";
import { Settings } from "src/domain/models/Settings";

export class CalendarSettingsTab extends PluginSettingTab {
    constructor(
        plugin: Plugin,
        private readonly settingsRepository: SettingsRepository
    ) {
        super(plugin.app, plugin);
    }

    override async display(): Promise<void> {
        this.containerEl.empty();
        var settings = await this.settingsRepository.getSettings();

        this.addDailyNoteSettings(settings);
        this.addWeeklyNoteSettings(settings);
    }

    private addDailyNoteSettings(settings: Settings) {
        this.addSection("Daily notes", "Daily notes are created or opened by clicking on any date in the calendar.");

        this.addSetting(dailyNoteNameSetting(settings.dailyNoteNameTemplate), async value => {
            settings.dailyNoteNameTemplate = value;
            await this.settingsRepository.storeSettings(settings);
        });
        this.addSetting(dailyNoteTemplateFile(settings.dailyNoteTemplateFile), async value => {
            settings.dailyNoteTemplateFile = value;
            await this.settingsRepository.storeSettings(settings);
        });
        this.addSetting(dailyNoteFolderSetting(settings.dailyNotesFolder), async value => {
            settings.dailyNotesFolder = value;
            await this.settingsRepository.storeSettings(settings);
        });
    }

    private addWeeklyNoteSettings(settings: Settings) {
        this.addSection("Weekly notes", "Weekly notes are created or opened by clicking on the week number in the calendar.");
        
        this.addSetting(weeklyNoteNameTemplateSetting(settings.weeklyNoteNameTemplate), async value => {
            settings.weeklyNoteNameTemplate = value;
            await this.settingsRepository.storeSettings(settings);
        });
        this.addSetting(weeklyNoteTemplateFile(settings.weeklyNoteTemplateFile), async value => {
            settings.weeklyNoteTemplateFile = value;
            await this.settingsRepository.storeSettings(settings);
        });
        this.addSetting(weeklyNoteFolderSetting(settings.weeklyNoteFolder), async value => {
            settings.weeklyNoteFolder = value;
            await this.settingsRepository.storeSettings(settings);
        });
    }

    private addSetting(setting: SettingsUiModel, onChange: (value: string) => void) {
        this.createSetting(setting)
            .addText(component => component
                .setPlaceholder(setting.placeholder)
                .setValue(setting.value)
                .onChange(value => onChange(value))
            );
    }

    private addSection(name: string, description: string): void {
        new Setting(this.containerEl)
            .setHeading()
            .setName(name)
            .setDesc(description);
    }

    private createSetting(setting: SettingsUiModel): Setting {
        return new Setting(this.containerEl)
            .setName(setting.name)
            .setDesc(setting.description);
    }
}
