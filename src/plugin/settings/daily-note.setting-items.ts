import {SettingsRepository} from 'src/domain/repositories/settings.repository';
import {PluginSettingTab} from 'obsidian';
import {PeriodicNoteSettingItems} from 'src/plugin/settings/periodic-note-setting-items';
import {PeriodicNoteSettingUiModel} from 'src/plugin/model/periodic-note-setting-ui.model';
import {DateParser} from 'src/domain/parsers/date.parser';
import {DailyNotesPeriodicNoteSettings} from 'src/domain/models/settings/daily-notes.periodic-note-settings';

export class DailyNoteSettingItems extends PeriodicNoteSettingItems {
    constructor(
        settingsTab: PluginSettingTab,
        dateParser: DateParser,
        private readonly settingsRepository: SettingsRepository<DailyNotesPeriodicNoteSettings>
    ) {
        super(settingsTab, dateParser);
    }

    override async registerSettings(): Promise<void> {
        const settings = await this.settingsRepository.getSettings();

        this.addHeading("Daily notes", "Daily notes are created or opened by clicking on any date in the calendar.");
        this.addPeriodicDateSetting(nameTemplateSetting(settings.nameTemplate), async value => {
            settings.nameTemplate = value;
            await this.settingsRepository.storeSettings(settings);
        });

        this.addPeriodicDateSetting(folderSetting(settings.folder), async value => {
            settings.folder = value;
            await this.settingsRepository.storeSettings(settings);
        });

        this.addSetting(templateFileSetting(settings.templateFile), async value => {
            settings.templateFile = value;
            await this.settingsRepository.storeSettings(settings);
        });
    }
}

const nameTemplateSetting = (value: string): PeriodicNoteSettingUiModel => ({
    name: 'Daily note name template',
    description: 'The template used to create the daily note name.',
    placeholder: 'yyyy-MM-dd - eeee',
    value: value
});

const templateFileSetting = (value: string): PeriodicNoteSettingUiModel => ({
    name: 'Daily note template',
    description: 'The template used to create the daily note.',
    placeholder: 'Templates/daily-note',
    value: value
});

const folderSetting = (value: string): PeriodicNoteSettingUiModel => ({
    name: 'Daily notes folder',
    description: 'The folder where you store your daily notes.',
    placeholder: `yyyy-'Daily notes'`,
    value: value
});
