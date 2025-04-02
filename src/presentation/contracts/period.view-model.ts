import {PluginSettings} from 'src/domain/settings/plugin.settings';
import {ModifierKey} from 'src/presentation/models/modifier-key';
import {Period} from 'src/domain/models/period.model';

export interface PeriodNoteViewModel {
    updateSettings(settings: PluginSettings): void;
    hasPeriodicNote(period: Period): Promise<boolean>;
    openNote(key: ModifierKey, period: Period): Promise<void>;
    openNoteInHorizontalSplitView(key: ModifierKey, period: Period): Promise<void>;
    openNoteInVerticalSplitView(key: ModifierKey, period: Period): Promise<void>;
    deleteNote(period: Period): Promise<void>;
}
