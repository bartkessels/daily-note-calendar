import {CommandHandlerFactory, CommandHandlerType} from 'src/presentation/contracts/command-handler-factory';
import {CommandHandler} from '../contracts/command-handler';
import {SettingsRepositoryFactory} from 'src/infrastructure/contracts/settings-repository-factory';
import {DateManagerFactory} from 'src/business/contracts/date-manager-factory';
import {DisplayInCalendarCommandHandler} from 'src/presentation/command-handlers/display-in-calendar.command-handler';
import {NoteManagerFactory} from 'src/business/contracts/note-manager-factory';
import {
    NavigateToCurrentWeekCommandHandler
} from 'src/presentation/command-handlers/navigate-to-current-week.command-handler';
import {
    NavigateToPreviousWeekCommandHandler
} from 'src/presentation/command-handlers/navigate-to-previous-week.command-handler';
import {
    NavigateToNextWeekCommandHandler
} from 'src/presentation/command-handlers/navigate-to-next-week.command-handler';
import {OpenYesterdaysNoteCommandHandler} from 'src/presentation/command-handlers/open-yesterdays-note.command-handler';
import {OpenTomorrowsNoteCommandHandler} from 'src/presentation/command-handlers/open-tomorrows-note.command-handler';
import {OpenWeeklyNoteCommandHandler} from 'src/presentation/command-handlers/open-weekly-note.command-handler';
import {
    NavigateToPreviousMonthCommandHandler
} from 'src/presentation/command-handlers/navigate-to-previous-month.command-handler';
import {
    NavigateToNextMonthCommandHandler
} from 'src/presentation/command-handlers/navigate-to-next-month.command-handler';
import {WeekPeriodNoteViewModel} from 'src/presentation/view-models/week.period-note-view-model';
import {DayPeriodNoteViewModel} from 'src/presentation/view-models/day.period-note-view-model';
import {CalendarViewModel} from 'src/presentation/contracts/calendar.view-model';

export class DefaultCommandHandlerFactory implements CommandHandlerFactory {
    constructor(
        private readonly noteManagerFactory: NoteManagerFactory,
        private readonly settingsRepositoryFactory: SettingsRepositoryFactory,
        private readonly dateManagerFactory: DateManagerFactory,
        private readonly calendarViewModel: CalendarViewModel,
        private readonly weekNoteViewModel: WeekPeriodNoteViewModel,
        private readonly dayNoteViewModel: DayPeriodNoteViewModel
    ) {

    }

    public getHandler(type: CommandHandlerType): CommandHandler {
        switch (type) {
            case CommandHandlerType.DisplayInCalendar:
                return new DisplayInCalendarCommandHandler(this.noteManagerFactory, this.settingsRepositoryFactory, this.calendarViewModel);
            case CommandHandlerType.NavigateToCurrentWeek:
                return new NavigateToCurrentWeekCommandHandler(this.weekNoteViewModel);
            case CommandHandlerType.NavigateToPreviousWeek:
                return new NavigateToPreviousWeekCommandHandler(this.calendarViewModel);
            case CommandHandlerType.NavigateToNextWeek:
                return new NavigateToNextWeekCommandHandler(this.calendarViewModel);
            case CommandHandlerType.NavigateToPreviousMonth:
                return new NavigateToPreviousMonthCommandHandler(this.calendarViewModel);
            case CommandHandlerType.NavigateToNextMonth:
                return new NavigateToNextMonthCommandHandler(this.calendarViewModel);
            case CommandHandlerType.OpenYesterdaysNote:
                return new OpenYesterdaysNoteCommandHandler(this.dateManagerFactory, this.dayNoteViewModel);
            case CommandHandlerType.OpenTomorrowsNote:
                return new OpenTomorrowsNoteCommandHandler(this.dateManagerFactory, this.dayNoteViewModel);
            case CommandHandlerType.OpenWeeklyNote:
                return new OpenWeeklyNoteCommandHandler(this.dateManagerFactory, this.settingsRepositoryFactory, this.weekNoteViewModel);
        }
    }

}