import {PeriodNoteSettings} from 'src-new/domain/settings/period-note.settings';
import {Period} from 'src-new/domain/models/period.model';

export interface PeriodicNoteManager {
    createNote(settings: PeriodNoteSettings, period: Period): Promise<void>;
    openNote(settings: PeriodNoteSettings, period: Period): Promise<void>;
    deleteNote(settings: PeriodNoteSettings, period: Period): Promise<void>;
}