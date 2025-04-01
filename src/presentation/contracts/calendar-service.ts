import {PluginSettings} from 'src/domain/settings/plugin.settings';
import {ModifierKey} from 'src/presentation/models/modifier-key';
import {PeriodNoteSettings} from 'src/domain/settings/period-note.settings';
import {Period} from 'src/domain/models/period.model';
import {WeekModel} from 'src/domain/models/week.model';

export interface CalendarService {
    initialize(settings: PluginSettings): void;
    openPeriodicNote(key: ModifierKey, period: Period, settings: PeriodNoteSettings): Promise<void>;
    openNoteInHorizontalSplitView(key: ModifierKey, period: Period, settings: PeriodNoteSettings): Promise<void>;
    openNoteInVerticalSplitView(key: ModifierKey, period: Period, settings: PeriodNoteSettings): Promise<void>;
    deletePeriodicNote(period: Period, settings: PeriodNoteSettings): Promise<void>;
    getCurrentWeek(): WeekModel[];
    getPreviousWeek(weeks: WeekModel[]): WeekModel[];
    getNextWeek(weeks: WeekModel[]): WeekModel[];
    getPreviousMonth(weeks: WeekModel[]): WeekModel[];
    getNextMonth(weeks: WeekModel[]): WeekModel[];
}