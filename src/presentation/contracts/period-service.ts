import {ModifierKey} from 'src/presentation/models/modifier-key';
import {Period} from 'src/domain/models/period.model';
import {PluginSettings} from 'src/domain/settings/plugin.settings';
import {PeriodNoteSettings} from 'src/domain/settings/period-note.settings';

export interface PeriodService {
    initialize(settings: PluginSettings): void;
    openNoteInCurrentTab(key: ModifierKey, period: Period, settings: PeriodNoteSettings): Promise<void>;
    openNoteInHorizontalSplitView(key: ModifierKey, period: Period, settings: PeriodNoteSettings): Promise<void>;
    openNoteInVerticalSplitView(key: ModifierKey, period: Period, settings: PeriodNoteSettings): Promise<void>;
    deleteNote(period: Period, settings: PeriodNoteSettings): Promise<void>;
    hasPeriodicNote(period: Period, settings: PeriodNoteSettings): Promise<boolean>;
}