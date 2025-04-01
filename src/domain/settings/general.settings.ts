import {Settings} from 'src/domain/settings/settings';
import {DayOfWeek, WeekNumberStandard} from 'src/domain/models/week.model';

export interface GeneralSettings extends Settings {
    displayNotesCreatedOnDate: boolean;
    displayNoteIndicator: boolean;
    useModifierKeyToCreateNote: boolean;
    firstDayOfWeek: DayOfWeek;
    weekNumberStandard: WeekNumberStandard;
}

export const DEFAULT_GENERAL_SETTINGS: GeneralSettings = {
    displayNotesCreatedOnDate: false,
    displayNoteIndicator: true,
    useModifierKeyToCreateNote: false,
    firstDayOfWeek: DayOfWeek.Monday,
    weekNumberStandard: WeekNumberStandard.ISO
}
