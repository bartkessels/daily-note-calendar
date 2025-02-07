import {Settings} from 'src-old/domain/models/settings/settings';
import {DayOfWeek} from 'src-old/domain/models/day';

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
    firstDayOfWeek: DayOfWeek.Monday
}