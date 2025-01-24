import {DayOfWeek, WeekModel} from 'src-new/domain/models/week.model';
import {Period} from 'src-new/domain/models/date.model';
import {DEFAULT_GENERAL_SETTINGS} from 'src-new/domain/settings/general.settings';

export interface CalendarModel {
    viewState: CalendarViewState;
    firstDayOfWeek: DayOfWeek;
    weeks: WeekModel[];
    selectedPeriod?: Period;
    currentDay?: Period;
}

export function createEmptyCalendarModel(): CalendarModel {
    return {
        viewState: CalendarViewState.Empty,
        firstDayOfWeek: DEFAULT_GENERAL_SETTINGS.firstDayOfWeek,
        weeks: []
    };
}

export enum CalendarViewState {
    Empty,
    Loading,
    Loaded
}