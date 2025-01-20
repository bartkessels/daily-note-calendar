import {Settings} from 'src-new/domain/settings/settings';

export interface QuarterlyNoteSettings extends Settings {
    nameTemplate: string,
    folder: string,
    templateFile: string
}

export const DEFAULT_QUARTERLY_NOTE_SETTINGS: QuarterlyNoteSettings = {
    nameTemplate: 'yyyy-qqq',
    folder: 'Quarterly notes',
    templateFile: 'Templates/Quarterly note'
}
