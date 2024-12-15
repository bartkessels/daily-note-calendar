import {DayUiModel} from 'src/components/day.ui-model';
import {Enhancer} from 'src/components/enhancers/enhancer';
import {FileAdapter} from 'src/domain/adapters/file.adapter';
import {NameBuilder} from 'src/domain/builders/name.builder';
import {Day} from 'src/domain/models/day';
import {SettingsRepository} from 'src/domain/repositories/settings.repository';
import {DailyNotesPeriodicNoteSettings} from 'src/domain/models/settings/daily-notes.periodic-note-settings';

export class DayUiModelEnhancer implements Enhancer<DayUiModel> {
    private settings?: DailyNotesPeriodicNoteSettings;

    constructor(
        private readonly settingsRepository: SettingsRepository<DailyNotesPeriodicNoteSettings>,
        private readonly nameBuilder: NameBuilder<Day>,
        private readonly fileAdapter: FileAdapter
    ) {

    }

    public async enhance(day?: DayUiModel): Promise<DayUiModel | undefined> {
        if (!day?.currentDay) {
            return;
        }

        if (!this.settings) {
            this.settings = await this.settingsRepository.getSettings();
        }

        return this.enhanceHasNote(day, day.currentDay, this.settings);
    }

    private async enhanceHasNote(model: DayUiModel, day: Day, settings: DailyNotesPeriodicNoteSettings): Promise<DayUiModel> {
        const filePath = this.nameBuilder
            .withPath(settings.folder)
            .withNameTemplate(settings.nameTemplate)
            .withValue(day)
            .build();
        const hasNote = await this.fileAdapter.doesFileExist(filePath);

        return {
            ...model,
            hasNote: hasNote
        };
    }
}