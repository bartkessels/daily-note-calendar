import {Settings} from 'src/domain/settings/settings';

export interface PeriodNoteSettings extends Settings {
    nameTemplate: string,
    folder: string,
    templateFile: string
}

export const DEFAULT_DAILY_NOTE_SETTINGS: PeriodNoteSettings = {
    nameTemplate: 'yyyy-MM-dd',
    folder: 'Daily notes',
    templateFile: 'Templates/Daily note'
}

export const DEFAULT_WEEKLY_NOTE_SETTINGS: PeriodNoteSettings = {
    nameTemplate: 'yyyy-ww',
    folder: 'Weekly notes',
    templateFile: 'Templates/Weekly note'
}

export const DEFAULT_MONTHLY_NOTE_SETTINGS: PeriodNoteSettings = {
    nameTemplate: 'yyyy-MM',
    folder: 'Monthly notes',
    templateFile: 'Templates/Monthly note'
}

export const DEFAULT_QUARTERLY_NOTE_SETTINGS: PeriodNoteSettings = {
    nameTemplate: 'yyyy-qqq',
    folder: 'Quarterly notes',
    templateFile: 'Templates/Quarterly note'
}

export const DEFAULT_YEARLY_NOTE_SETTINGS: PeriodNoteSettings = {
    nameTemplate: 'yyyy',
    folder: 'Yearly notes',
    templateFile: 'Templates/Yearly note'
}
