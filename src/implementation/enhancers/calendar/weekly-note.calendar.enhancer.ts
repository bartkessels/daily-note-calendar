import {Enhancer} from 'src/domain/enhancers/enhancer';
import {CalendarUiModel} from 'src/components/models/calendar.ui-model';
import {SettingsRepository} from 'src/domain/repositories/settings.repository';
import {GeneralSettings} from 'src/domain/models/settings/general.settings';
import {DailyNotesPeriodicNoteSettings} from 'src/domain/models/settings/daily-notes.periodic-note-settings';
import {NameBuilder} from 'src/domain/builders/name.builder';
import {FileAdapter} from 'src/domain/adapters/file.adapter';
import {WeekUiModel} from 'src/components/models/week.ui-model';
import {Event} from 'src/domain/events/event';
import {WeeklyNotesPeriodicNoteSettings} from 'src/domain/models/settings/weekly-notes.periodic-note-settings';
import {Week} from 'src/domain/models/week';

// export class WeeklyNoteCalendarEnhancer extends Enhancer<CalendarUiModel> {
//     constructor(
//         event: Event<CalendarUiModel>,
//         private readonly generalSettingsRepository: SettingsRepository<GeneralSettings>,
//         private readonly settingsRepository: SettingsRepository<WeeklyNotesPeriodicNoteSettings>,
//         private readonly nameBuilder: NameBuilder<Week>,
//         private readonly fileAdapter: FileAdapter,
//     ) {
//         super(event);
//     }
//
//     override async enhance(value: CalendarUiModel): Promise<CalendarUiModel> {
//         const generalSettings = await this.generalSettingsRepository.getSettings();
//
//         if (!value?.currentMonth?.weeks || !generalSettings.displayNoteIndicator) {
//             return value;
//         }
//
//         const settings = await this.settingsRepository.getSettings();
//         const enhancedWeeks = await this.enhanceWeeks(value.currentMonth.weeks, settings);
//
//         return {
//             ...value,
//             currentMonth: {
//                 ...value.currentMonth,
//                 weeks: enhancedWeeks
//             }
//         };
//     }
//
//     private async enhanceWeeks(weeks: WeekUiModel[], settings: DailyNotesPeriodicNoteSettings): Promise<WeekUiModel[]> {
//         return await Promise.all(weeks.map(async week => await this.enhanceWeek(week, settings)));
//     }
//
//     private async enhanceWeek(week: WeekUiModel, settings: DailyNotesPeriodicNoteSettings): Promise<WeekUiModel> {
//         if (!week.hasNote) {
//             return week;
//         }
//
//         const filePath = this.nameBuilder
//             .withPath(settings.folder)
//             .withNameTemplate(settings.nameTemplate)
//             .withValue(week.week)
//             .build();
//         const hasNote = await this.fileAdapter.doesFileExist(filePath);
//
//         return {
//             ...week,
//             hasNote: hasNote
//         };
//     }
// }