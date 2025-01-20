import {Settings} from 'src-new/domain/settings/settings';

export interface GeneralSettings extends Settings {
    displayNotesCreatedOnDate: boolean;
    displayNoteIndicator: boolean;
    useModifierKeyToCreateNote: boolean;
    firstDayOfWeek: number;
}

export const DEFAULT_GENERAL_SETTINGS: GeneralSettings = {
    displayNotesCreatedOnDate: false,
    displayNoteIndicator: true,
    useModifierKeyToCreateNote: false,
    firstDayOfWeek: 1 //DayOfWeek.Monday
}
