import {PeriodEnhancer} from 'src/domain/enhancers/period-enhancer';
import {Week, WeekProperty} from 'src/domain/models/week';
import {SettingsRepository} from 'src/domain/repositories/settings.repository';
import {WeeklyNotesPeriodicNoteSettings} from 'src/domain/models/settings/weekly-notes.periodic-note-settings';
import {NameBuilder} from 'src/domain/builders/name.builder';
import {FileAdapter} from 'src/domain/adapters/file.adapter';

export class WeekPeriodEnhancer implements PeriodEnhancer<WeekProperty> {
    constructor(
        private readonly settingsRepository: SettingsRepository<WeeklyNotesPeriodicNoteSettings>,
        private readonly nameBuilder: NameBuilder<Week>,
        private readonly fileAdapter: FileAdapter
    ) {

    }

    public async enhance(week: Week): Promise<Week> {
        const settings = await this.settingsRepository.getSettings();
        const path = this.nameBuilder
            .withPath(settings.folder)
            .withNameTemplate(settings.nameTemplate)
            .withValue(week)
            .build();

        const hasWeeklyNote = await this.fileAdapter.doesFileExist(path);
        return <Week>{
            ...week,
            properties: {
                ...week.properties,
                hasPeriodicNote: hasWeeklyNote
            }
        };
    }
}