import {SettingsView, SettingUiModel} from 'src/presentation/settings/settings-view';
import {PluginSettingTab, Setting} from 'obsidian';
import {SettingsRepositoryFactory, SettingsType} from 'src/infrastructure/contracts/settings-repository-factory';
import {DisplayNotesSettings} from 'src/domain/settings/display-notes.settings';
import {DateParserFactory} from 'src/infrastructure/contracts/date-parser-factory';
import { SortNotes } from 'src/domain/models/note.model';

export class DisplayNotesSettingsView extends SettingsView {
    override title = "Notes settings";
    override description = "Settings for the notes that are displayed below the calendar.";

    constructor(
        settingsTab: PluginSettingTab,
        onSettingsChange: () => void,
        private readonly dateParserFactory: DateParserFactory,
        private readonly settingsRepositoryFactory: SettingsRepositoryFactory
    ) {
        super(settingsTab, onSettingsChange);
    }

    override async addSettings(): Promise<void> {
        const dateParser = this.dateParserFactory.getParser();
        const settingsRepository = this.settingsRepositoryFactory
            .getRepository<DisplayNotesSettings>(SettingsType.DisplayNotes);
        const settings = await settingsRepository.get();

        this.addSortOrderSetting(settings.sortNotes, async value => {
            settings.sortNotes = value;
            await settingsRepository.store(settings);
        });

        this.addDateParseSetting(this.getDisplayDateTemplateSetting(settings.displayDateTemplate), dateParser, async value => {
            settings.displayDateTemplate = value;
            await settingsRepository.store(settings);
        });
        this.addBooleanSetting(this.getUseCreatedOnDateFromPropertiesSetting(settings.useCreatedOnDateFromProperties), async value => {
            settings.useCreatedOnDateFromProperties = value;
            await settingsRepository.store(settings);
        });
        this.addTextSetting(this.getCreatedOnDatePropertyNameSetting(settings.createdOnDatePropertyName), async value => {
            settings.createdOnDatePropertyName = value;
            await settingsRepository.store(settings);
        });
        this.addDateParseSetting(this.getCreatedOnPropertyFormatSetting(settings.createdOnPropertyFormat), dateParser, async value => {
            settings.createdOnPropertyFormat = value;
            await settingsRepository.store(settings);
        });
    }

    private getDisplayDateTemplateSetting(value: string): SettingUiModel<string> {
        return <SettingUiModel<string>> {
            name: 'Display date template',
            description: 'The template to use when displaying the date of the note.',
            placeholder: 'HH:mm',
            value: value
        };
    }

    private getUseCreatedOnDateFromPropertiesSetting(value: boolean): SettingUiModel<boolean> {
        return <SettingUiModel<boolean>> {
            name: 'Use property for the created date of a note',
            description: 'Use the property to determine the created date of the note.',
            placeholder: '',
            value: value
        };
    }

    private getCreatedOnDatePropertyNameSetting(value: string): SettingUiModel<string> {
        return <SettingUiModel<string>> {
            name: 'Property name for created date',
            description: 'The property to use to determine the created date of the note. This is only applicable if the "Use property for created date" setting is enabled.',
            placeholder: '',
            value: value
        };
    }

    private getCreatedOnPropertyFormatSetting(value: string): SettingUiModel<string> {
        return <SettingUiModel<string>> {
            name: 'Created date format',
            description: 'The format to use when parsing the created date from the property.',
            placeholder: 'yyyy/MM/dd HH:mm',
            value: value
        };
    }

    private addSortOrderSetting(value: SortNotes, onValueChange: (value: SortNotes) => Promise<void>): void {
        const options = new Map<string, string>();
        options.set('ascending', 'Ascending');
        options.set('descending', 'Descending');

        this.addDropdownSetting(
            'Display order for the notes',
            'The order in which the notes will be ordered based on the created date.',
            options,
            value.toLowerCase(),
            async (value) => {
                if (value.toLowerCase() === 'ascending') {
                    return await onValueChange(SortNotes.Ascending);
                } else {
                    return await onValueChange(SortNotes.Descending);
                }
            }
        );
    }
}