import {Settings} from 'src-new/domain/settings/settings';

export interface YearlyNoteSettings extends Settings {
    nameTemplate: string,
    folder: string,
    templateFile: string
}

export const DEFAULT_YEARLY_NOTE_SETTINGS: YearlyNoteSettings = {
    nameTemplate: 'yyyy',
    folder: 'Yearly notes',
    templateFile: 'Templates/Yearly note'
}
