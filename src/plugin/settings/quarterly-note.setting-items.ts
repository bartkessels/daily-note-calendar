import {SettingsRepository} from 'src/domain/repositories/settings.repository';
import {PluginSettingTab} from 'obsidian';
import {PeriodicNoteSettingItems} from 'src/plugin/settings/periodic-note-setting-items';
import {PeriodicNoteSettingUiModel} from 'src/plugin/model/periodic-note-setting-ui.model';
import {DateParser} from 'src/domain/parsers/date.parser';
import {QuarterlyNotesPeriodicNoteSettings} from 'src/domain/models/settings/quarterly-notes.periodic-note-settings';

export class QuarterlyNoteSettingItems extends PeriodicNoteSettingItems {
    constructor(
        settingsTab: PluginSettingTab,
        dateParser: DateParser,
        private readonly settingsRepository: SettingsRepository<QuarterlyNotesPeriodicNoteSettings>
    ) {
        super(settingsTab, dateParser);
    }

    override async registerSettings(): Promise<void> {
        const settings = await this.settingsRepository.getSettings();

        this.addHeading("Quarterly notes", "Quarterly notes are created or opened by clicking on a quarter in the upper-left corner of the calendar.");
        this.addDateParseSetting(nameTemplateSetting(settings.nameTemplate), async value => {
            settings.nameTemplate = value;
            await this.settingsRepository.storeSettings(settings);
        });

        this.addDateParseSetting(folderSetting(settings.folder), async value => {
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
    name: 'Quarterly note name template',
    description: 'Format example:',
    placeholder: 'yyyy - qqq',
    value: value
});

const folderSetting = (value: string): PeriodicNoteSettingUiModel => ({
    name: 'Quarterly notes folder',
    description: 'The folder where you store your quarterly notes:',
    placeholder: 'Quarterly notes',
    value: value
});

const templateFileSetting = (value: string): PeriodicNoteSettingUiModel => ({
    name: 'Quarterly note template',
    description: 'The template used to create the quarterly note',
    placeholder: 'Templates/quarterly-note',
    value: value
});
