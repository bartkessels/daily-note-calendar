import {PeriodNoteSettings} from 'src/domain/settings/period-note.settings';
import {Period} from 'src/domain/models/period.model';
import {DayOfWeek} from 'src/domain/models/week';

export interface PeriodicNoteManager {
    doesNoteExist(settings: PeriodNoteSettings, period: Period, firstDayOfWeek: DayOfWeek): Promise<boolean>;
    createNote(settings: PeriodNoteSettings, period: Period, firstDayOfWeek: DayOfWeek): Promise<void>;
    openNote(settings: PeriodNoteSettings, period: Period, firstDayOfWeek: DayOfWeek): Promise<void>;
    openNoteInHorizontalSplitView(settings: PeriodNoteSettings, period: Period, firstDayOfWeek: DayOfWeek): Promise<void>;
    openNoteInVerticalSplitView(settings: PeriodNoteSettings, period: Period, firstDayOfWeek: DayOfWeek): Promise<void>;
    deleteNote(settings: PeriodNoteSettings, period: Period, firstDayOfWeek: DayOfWeek): Promise<void>;
}