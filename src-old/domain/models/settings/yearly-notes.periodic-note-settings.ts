import {PeriodicNoteSettings} from 'src-old/domain/models/settings/periodic-note.settings';

export interface YearlyNotesPeriodicNoteSettings extends PeriodicNoteSettings {
    nameTemplate: string,
    folder: string,
    templateFile: string
}

export const DEFAULT_YEARLY_NOTES_PERIODIC_NOTE_SETTINGS: YearlyNotesPeriodicNoteSettings = {
    nameTemplate: 'yyyy',
    folder: 'Yearly notes',
    templateFile: 'Templates/Yearly note'
}