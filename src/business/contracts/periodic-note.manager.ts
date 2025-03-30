import {PeriodNoteSettings} from 'src/domain/settings/period-note.settings';
import {Period} from 'src/domain/models/period.model';

export interface PeriodicNoteManager {
    doesNoteExist(settings: PeriodNoteSettings, period: Period): Promise<boolean>;
    createNote(settings: PeriodNoteSettings, period: Period): Promise<void>;
    openNote(settings: PeriodNoteSettings, period: Period): Promise<void>;
    deleteNote(settings: PeriodNoteSettings, period: Period): Promise<void>;
}