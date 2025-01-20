import {Settings} from 'src-new/domain/settings/settings';

export interface DailyNoteSettings extends Settings {
    nameTemplate: string,
    folder: string,
    templateFile: string
}

export const DEFAULT_DAILY_NOTE_SETTINGS: DailyNoteSettings = {
    nameTemplate: 'yyyy-MM-dd',
    folder: 'Daily notes',
    templateFile: 'Templates/Daily note'
}
