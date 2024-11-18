import {Settings} from 'src/domain/models/settings/settings';

export interface GeneralSettings extends Settings {
    displayNotesCreatedOnDate: boolean
}

export const DEFAULT_GENERAL_SETTINGS: GeneralSettings = {
    displayNotesCreatedOnDate: false
}