import {PluginSettings} from 'src/domain/settings/plugin.settings';
import {CalendarUiModel} from 'src/presentation/models/calendar.ui-model';
import {Period} from 'src/domain/models/period.model';
import {ModifierKey} from 'src/presentation/models/modifier-key';
import {PeriodNoteSettings} from 'src/domain/settings/period-note.settings';
import {PeriodUiModel} from 'src/presentation/models/period.ui-model';

type Callback = (model: CalendarUiModel) => void;

export interface CalendarService {
    initialize(settings: PluginSettings, period: Period, callback: Callback): void;

    // TODO: Is this the way to go?, in this case the viewmodel will be responsible for the updating of the model
    openPeriodicNote(key: ModifierKey, period: PeriodUiModel, settings: PeriodNoteSettings): Promise<void>;

    selectPeriod(model: CalendarUiModel | null, period: Period, callback: Callback): void;
    loadCurrentWeek(model: CalendarUiModel | null, callback: Callback): void;
    loadPreviousWeek(model: CalendarUiModel | null, callback: Callback): void;
    loadNextWeek(model: CalendarUiModel | null, callback: Callback): void;
    loadPreviousMonth(model: CalendarUiModel | null, callback: Callback): void;
    loadNextMonth(model: CalendarUiModel | null, callback: Callback): void;
    // openPeriodicNote(model: CalendarUiModel | null, key: ModifierKey, period: PeriodUiModel, settings: PeriodNoteSettings, callback: Callback): void;
}