import {PeriodicNoteSettings} from 'src/domain/models/settings/periodic-note.settings';

export interface MonthlyNotesPeriodicNoteSettings extends PeriodicNoteSettings {
    nameTemplate: string,
    folder: string,
    templateFile: string
}

export const DEFAULT_MONTHLY_NOTES_PERIODIC_SETTINGS: MonthlyNotesPeriodicNoteSettings = {
    nameTemplate: 'yyyy-MM',
    folder: 'Monthly notes',
    templateFile: 'Templates/Monthly note'
}