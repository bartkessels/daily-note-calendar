import {Settings} from 'src-new/domain/settings/settings';

export interface MonthlyNoteSettings extends Settings {
    nameTemplate: string,
    folder: string,
    templateFile: string
}

export const MONTHLY_NOTE_SETTINGS_KEY = 'monthly-notes-settings';

export const DEFAULT_MONTHLY_NOTE_SETTINGS: MonthlyNoteSettings = {
    nameTemplate: 'yyyy-MM',
    folder: 'Monthly notes',
    templateFile: 'Templates/Monthly note'
}
