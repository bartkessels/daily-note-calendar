import {PluginSettings} from 'src/domain/settings/plugin.settings';
import {ModifierKey} from 'src/presentation/models/modifier-key';
import {PeriodNoteSettings} from 'src/domain/settings/period-note.settings';
import {PeriodUiModel} from 'src/presentation/models/period.ui-model';
import {WeekUiModel} from 'src/presentation/models/week.ui-model';

export interface CalendarService {
    initialize(settings: PluginSettings): void;
    openPeriodicNote(key: ModifierKey, period: PeriodUiModel, settings: PeriodNoteSettings): Promise<void>;
    getCurrentWeek(): Promise<WeekUiModel[]>;
    getPreviousWeek(weeks: WeekUiModel[]): Promise<WeekUiModel[]>;
    getNextWeek(weeks: WeekUiModel[]): Promise<WeekUiModel[]>;
    getPreviousMonth(weeks: WeekUiModel[]): Promise<WeekUiModel[]>;
    getNextMonth(weeks: WeekUiModel[]): Promise<WeekUiModel[]>;
}