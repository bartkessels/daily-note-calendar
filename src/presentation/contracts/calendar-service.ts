import {PluginSettings} from 'src/domain/settings/plugin.settings';
import {CalendarUiModel} from 'src/presentation/models/calendar.ui-model';
import {Period} from 'src/domain/models/period.model';
import { ModifierKey } from 'src/presentation/models/modifier-key';
import {PeriodNoteSettings} from 'src/domain/settings/period-note.settings';

type Callback = (model: CalendarUiModel) => void;

export interface CalendarService {
    initialize(settings: PluginSettings, callback: Callback): void;
    loadPreviousWeek(model: CalendarUiModel, callback: Callback): void;
    loadNextWeek(model: CalendarUiModel, callback: Callback): void;
    openPeriodicNote(key: ModifierKey, period: Period, settings: PeriodNoteSettings): Promise<void>;
}