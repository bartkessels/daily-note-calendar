import {PeriodicNoteSettings} from 'src-old/domain/models/settings/periodic-note.settings';

export interface WeeklyNotesPeriodicNoteSettings extends PeriodicNoteSettings {
    nameTemplate: string,
    folder: string,
    templateFile: string
}

export const DEFAULT_WEEKLY_NOTES_PERIODIC_SETTINGS: WeeklyNotesPeriodicNoteSettings = {
    nameTemplate: 'yyyy-ww',
    folder: 'Weekly notes',
    templateFile: 'Templates/Weekly note'
}