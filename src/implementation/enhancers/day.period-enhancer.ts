import {PeriodEnhancer} from 'src/domain/enhancers/period-enhancer';
import {Day, DayProperty} from 'src/domain/models/day';
import {SettingsRepository} from 'src/domain/repositories/settings.repository';
import {DailyNotesPeriodicNoteSettings} from 'src/domain/models/settings/daily-notes.periodic-note-settings';
import {FileAdapter} from 'src/domain/adapters/file.adapter';
import {NameBuilder} from 'src/domain/builders/name.builder';

export class DayPeriodEnhancer implements PeriodEnhancer<DayProperty> {
    constructor(
        private readonly settingsRepository: SettingsRepository<DailyNotesPeriodicNoteSettings>,
        private readonly nameBuilder: NameBuilder<Day>,
        private readonly fileAdapter: FileAdapter
    ) {

    }

    public async enhance(day: Day): Promise<Day> {
        const settings = await this.settingsRepository.getSettings();
        const path = this.nameBuilder
            .withPath(settings.folder)
            .withNameTemplate(settings.nameTemplate)
            .withValue(day)
            .build();

        const hasDailyNote = await this.fileAdapter.doesFileExist(path);
        return <Day>{
            ...day,
            properties: {
                ...day.properties,
                hasPeriodicNote: hasDailyNote
            }
        };
    }
}