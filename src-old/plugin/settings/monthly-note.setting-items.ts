import {SettingsRepository} from 'src-old/domain/repositories/settings.repository';
import {PluginSettingTab} from 'obsidian';
import {PeriodicNoteSettingItems} from 'src-old/plugin/settings/periodic-note-setting-items';
import {PeriodicNoteSettingUiModel} from 'src-old/plugin/model/periodic-note-setting-ui.model';
import {DateParser} from 'src-old/domain/parsers/date.parser';
import {MonthlyNotesPeriodicNoteSettings} from 'src-old/domain/models/settings/monthly-notes.periodic-note-settings';

export class MonthlyNoteSettingItems extends PeriodicNoteSettingItems {
    constructor(
        settingsTab: PluginSettingTab,
        dateParser: DateParser,
        private readonly settingsRepository: SettingsRepository<MonthlyNotesPeriodicNoteSettings>
    ) {
        super(settingsTab, dateParser);
    }

    override async registerSettings(): Promise<void> {
        const settings = await this.settingsRepository.getSettings();

        this.addHeading("Monthly notes", "Monthly notes are created or opened by clicking on any month name in the calendar.");
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
    name: 'Monthly note name template',
    description: 'The template used to create the monthly note name.',
    placeholder: 'yyyy - MM',
    value: value
});

const folderSetting = (value: string): PeriodicNoteSettingUiModel => ({
    name: 'Monthly notes folder',
    description: 'The folder where you store your monthly notes.',
    placeholder: 'Monthly notes',
    value: value
});

const templateFileSetting = (value: string): PeriodicNoteSettingUiModel => ({
    name: 'Monthly note template',
    description: 'The template used to create the monthly note.',
    placeholder: 'Templates/monthly-note',
    value: value
});
