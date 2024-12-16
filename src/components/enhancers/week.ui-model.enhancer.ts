import {Enhancer} from 'src/components/enhancers/enhancer';
import {WeekUiModel} from 'src/components/week.ui-model';
import {Week} from 'src/domain/models/week';
import {WeeklyNotesPeriodicNoteSettings} from 'src/domain/models/settings/weekly-notes.periodic-note-settings';
import {FileAdapter} from 'src/domain/adapters/file.adapter';
import {NameBuilder} from 'src/domain/builders/name.builder';
import {SettingsRepository} from 'src/domain/repositories/settings.repository';

export class WeekUiModelEnhancer implements Enhancer<WeekUiModel> {
    private settings?: WeeklyNotesPeriodicNoteSettings;

    constructor(
        private readonly settingsRepository: SettingsRepository<WeeklyNotesPeriodicNoteSettings>,
        private readonly nameBuilder: NameBuilder<Week>,
        private readonly fileAdapter: FileAdapter
    ) {

    }

    public async enhance(week?: WeekUiModel): Promise<WeekUiModel | undefined> {
        if (!week?.week) {
            return;
        }

        if (!this.settings) {
            this.settings = await this.settingsRepository.getSettings();
        }

        return await this.enhanceHasNote(week, week.week, this.settings);
    }

    private async enhanceHasNote(model: WeekUiModel, week: Week, settings: WeeklyNotesPeriodicNoteSettings): Promise<WeekUiModel> {
        const filePath = this.nameBuilder
            .withPath(settings.folder)
            .withNameTemplate(settings.nameTemplate)
            .withValue(week)
            .build();
        const hasNote = await this.fileAdapter.doesFileExist(filePath);

        return {
            ...model,
            hasNote: hasNote
        };
    }
}