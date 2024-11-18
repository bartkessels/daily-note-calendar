import {PeriodicNoteSettings} from 'src/domain/models/settings/periodic-note.settings';

export interface QuarterlyNotesPeriodicNoteSettings extends PeriodicNoteSettings {
    nameTemplate: string,
    folder: string,
    templateFile: string
}

export const DEFAULT_QUARTERLY_NOTES_PERIODIC_NOTE_SETTINGS: QuarterlyNotesPeriodicNoteSettings = {
    nameTemplate: 'yyyy-Qq',
    folder: 'Quarterly notes',
    templateFile: 'Templates/Quarterly note'
}