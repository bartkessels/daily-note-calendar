import {Calendar} from 'src/domain/models/calendar.model';
import {Period} from 'src/domain/models/period.model';
import {PluginSettings} from 'src/domain/settings/plugin.settings';
import {Week} from 'src/domain/models/week';

export interface CalendarViewModel {
    setSelectedPeriod: (period: Period) => void;
    navigateToNextWeek: () => void;
    navigateToPreviousWeek: () => void;
    navigateToCurrentWeek: () => void;
    navigateToNextMonth: () => void;
    navigateToPreviousMonth: () => void;

    refreshNoteCounts: () => void;
    initializeNoteCountRefreshCallback(cb: () => void): void;

    refreshCalendar: () => void;
    initializeCalendarRefreshCallback(cb: () => void): void;
    rebuildCalendar(weeks: Week[]): Calendar;

    initialize(settings: PluginSettings, today: Period): void;
    updateToday(today: Period): void;
    initializeCallbacks(
        setSelectedPeriod: (period: Period) => void,
        navigateToNextWeek: () => void,
        navigateToPreviousWeek: () => void,
        navigateToCurrentWeek: () => void,
        navigateToNextMonth: () => void,
        navigateToPreviousMonth: () => void
    ): void;
    getCurrentWeek(): Calendar;
    getPreviousWeek(calendar: Calendar): Calendar;
    getNextWeek(calendar: Calendar): Calendar;
    getPreviousMonth(calendar: Calendar): Calendar;
    getNextMonth(calendar: Calendar): Calendar;
}
