import {Period} from 'src/domain/models/period.model';
import {PluginSettings} from 'src/domain/settings/plugin.settings';
import {PeriodNoteSettings} from 'src/domain/settings/period-note.settings';
import { ModifierKey } from 'src/domain/models/modifier-key';

export interface PeriodService {
    initialize(settings: PluginSettings): void;
    openNoteInCurrentTab(key: ModifierKey, period: Period, settings: PeriodNoteSettings): Promise<void>;
    openNoteInHorizontalSplitView(key: ModifierKey, period: Period, settings: PeriodNoteSettings): Promise<void>;
    openNoteInVerticalSplitView(key: ModifierKey, period: Period, settings: PeriodNoteSettings): Promise<void>;
    deleteNote(period: Period, settings: PeriodNoteSettings): Promise<void>;
    hasPeriodicNote(period: Period, settings: PeriodNoteSettings): Promise<boolean>;
}