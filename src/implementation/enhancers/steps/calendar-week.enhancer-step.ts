import {EnhancerStep} from 'src/domain/enhancers/enhancer-step';
import {CalendarUiModel} from 'src/components/models/calendar.ui-model';
import {WeeklyNotesPeriodicNoteSettings} from 'src/domain/models/settings/weekly-notes.periodic-note-settings';
import {SettingsRepository} from 'src/domain/repositories/settings.repository';
import { NameBuilder } from 'src/domain/builders/name.builder';
import {Week} from 'src/domain/models/week';
import { FileAdapter } from 'src/domain/adapters/file.adapter';
import {WeekUiModel} from 'src/components/models/week.ui-model';
import {PeriodicNoteSettings} from 'src/domain/models/settings/periodic-note.settings';
import {GeneralSettings} from 'src/domain/models/settings/general.settings';

export class CalendarWeekEnhancerStep implements EnhancerStep<CalendarUiModel> {
    constructor(
        private readonly generalSettingsRepository: SettingsRepository<GeneralSettings>,
        private readonly settingsRepository: SettingsRepository<WeeklyNotesPeriodicNoteSettings>,
        private readonly nameBuilder: NameBuilder<Week>,
        private readonly fileAdapter: FileAdapter
    ) {

    }

    public async execute(calendar?: CalendarUiModel): Promise<CalendarUiModel | undefined> {
        const generalSettings = await this.generalSettingsRepository.getSettings();

        if (!calendar?.currentMonth?.weeks || !generalSettings.displayNoteIndicator) {
            return calendar;
        }

        const settings = await this.settingsRepository.getSettings();
        const enhancedWeeks = await this.enhanceWeeks(calendar.currentMonth.weeks, settings);

        return {
            ...calendar,
            currentMonth: {
                ...calendar.currentMonth,
                weeks: enhancedWeeks
            }
        };
    }

    private async enhanceWeeks(weeks: WeekUiModel[], settings: PeriodicNoteSettings): Promise<WeekUiModel[]> {
        return await Promise.all(weeks.map(async week => {
            return await this.enhanceWeek(week, settings);
        }));
    }

    private async enhanceWeek(week: WeekUiModel, settings: PeriodicNoteSettings): Promise<WeekUiModel> {
        if (!week.week) {
            return week;
        }

        const filePath = this.nameBuilder
            .withPath(settings.folder)
            .withNameTemplate(settings.nameTemplate)
            .withValue(week.week)
            .build();
        const hasNote = await this.fileAdapter.doesFileExist(filePath);

        return {
            ...week,
            hasNote: hasNote
        };
    }
}