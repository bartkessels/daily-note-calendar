import {Settings} from 'src-new/domain/settings/settings';

export interface WeeklyNoteSettings extends Settings {
    nameTemplate: string,
    folder: string,
    templateFile: string
}

export const DEFAULT_WEEKLY_NOTE_SETTINGS: WeeklyNoteSettings = {
    nameTemplate: 'yyyy-ww',
    folder: 'Weekly notes',
    templateFile: 'Templates/Weekly note'
}
