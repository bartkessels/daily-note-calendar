import {PeriodicNoteSettings} from 'src-old/domain/models/settings/periodic-note.settings';

export interface DailyNotesPeriodicNoteSettings extends PeriodicNoteSettings {
    nameTemplate: string,
    folder: string,
    templateFile: string
}

export const DEFAULT_DAILY_NOTES_PERIODIC_NOTE_SETTINGS: DailyNotesPeriodicNoteSettings = {
    nameTemplate: 'yyyy-MM-dd',
    folder: 'Daily notes',
    templateFile: 'Templates/Daily note'
}