import {SettingsRepository} from 'src-old/domain/repositories/settings.repository';
import {PluginSettingTab} from 'obsidian';
import {PeriodicNoteSettingItems} from 'src-old/plugin/settings/periodic-note-setting-items';
import {PeriodicNoteSettingUiModel} from 'src-old/plugin/model/periodic-note-setting-ui.model';
import {DateParser} from 'src-old/domain/parsers/date.parser';
import {QuarterlyNotesPeriodicNoteSettings} from 'src-old/domain/models/settings/quarterly-notes.periodic-note-settings';

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
    name: 'Quarterly note name template',
    description: 'The template used to create the quarterly note name.',
    placeholder: 'yyyy - qqq',
    value: value
});

const folderSetting = (value: string): PeriodicNoteSettingUiModel => ({
    name: 'Quarterly notes folder',
    description: 'The folder where you store your quarterly notes.',
    placeholder: 'Quarterly notes',
    value: value
});

const templateFileSetting = (value: string): PeriodicNoteSettingUiModel => ({
    name: 'Quarterly note template',
    description: 'The template used to create the quarterly note.',
    placeholder: 'Templates/quarterly-note',
    value: value
});
