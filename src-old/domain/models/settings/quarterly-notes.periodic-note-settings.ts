import {PeriodicNoteSettings} from 'src-old/domain/models/settings/periodic-note.settings';

export interface QuarterlyNotesPeriodicNoteSettings extends PeriodicNoteSettings {
    nameTemplate: string,
    folder: string,
    templateFile: string
}

export const DEFAULT_QUARTERLY_NOTES_PERIODIC_NOTE_SETTINGS: QuarterlyNotesPeriodicNoteSettings = {
    nameTemplate: 'yyyy-qqq',
    folder: 'Quarterly notes',
    templateFile: 'Templates/Quarterly note'
}