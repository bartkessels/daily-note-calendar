import {SettingsRepository} from 'src/infrastructure/contracts/settings-repository';
import {PeriodNoteSettings} from 'src/domain/settings/period-note.settings';
import {DateParser} from 'src/infrastructure/contracts/date-parser';
import {SettingsView, SettingUiModel} from 'src/presentation/settings/settings-view';
import {PluginSettingTab} from 'obsidian';

export abstract class PeriodicNoteSettingsView extends SettingsView {
    protected constructor(
        settingsTab: PluginSettingTab,
        onSettingsChange: () => void,
        private readonly settingsRepository: SettingsRepository<PeriodNoteSettings>,
        private readonly dateParser: DateParser,
    ) {
        super(settingsTab, onSettingsChange);
    }

    override async addSettings(): Promise<void> {
        const settings = await this.settingsRepository.get();

        this.addDateParseSetting(this.getNameTemplateSetting(settings.nameTemplate), this.dateParser, async value => {
            settings.nameTemplate = value;
            await this.settingsRepository.store(settings);
        });
        this.addDateParseSetting(this.getFolderSetting(settings.folder), this.dateParser, async value => {
            settings.folder = value;
            await this.settingsRepository.store(settings);
        });
        this.addTextSetting(this.getTemplateFileSetting(settings.templateFile), async value => {
            settings.templateFile = value;
            await this.settingsRepository.store(settings);
        });
    }

    protected abstract getNameTemplateSetting(value: string): SettingUiModel<string>;
    protected abstract getFolderSetting(value: string): SettingUiModel<string>;
    protected abstract getTemplateFileSetting(value: string): SettingUiModel<string>;
}