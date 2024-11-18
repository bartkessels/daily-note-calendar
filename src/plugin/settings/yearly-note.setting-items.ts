import {PeriodicNoteSettingItems} from 'src/plugin/settings/periodic-note-setting-items';
import {PluginSettingTab} from 'obsidian';
import {SettingsRepository} from 'src/domain/repositories/settings.repository';
import type {PeriodicNoteSettingUiModel} from 'src/plugin/model/periodic-note-setting-ui.model';
import {DateParser} from 'src/domain/parsers/date.parser';
import {YearlyNotesPeriodicNoteSettings} from 'src/domain/models/settings/yearly-notes.periodic-note-settings';

export class YearlyNoteSettingItems extends PeriodicNoteSettingItems {
    constructor(
        settingsTab: PluginSettingTab,
        dateParser: DateParser,
        private readonly settingsRepository: SettingsRepository<YearlyNotesPeriodicNoteSettings>
    ) {
        super(settingsTab, dateParser);
    }

    override async registerSettings(): Promise<void> {
        const settings = await this.settingsRepository.getSettings();

        this.addHeading("Yearly notes", "Yearly notes are created or opened by clicking on the year in the calendar.");
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
    name: 'Yearly note name template',
    description: 'Format example:',
    placeholder: 'yyyy',
    value: value
});

const folderSetting = (value: string): PeriodicNoteSettingUiModel => ({
    name: 'Yearly notes folder',
    description: 'The folder where you store your yearly notes:',
    placeholder: 'Yearly notes',
    value: value
});

const templateFileSetting = (value: string): PeriodicNoteSettingUiModel => ({
    name: 'Yearly note template',
    description: 'The template used to create the yearly note',
    placeholder: 'Templates/yearly-note',
    value: value
});
