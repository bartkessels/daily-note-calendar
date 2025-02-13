import {CommandHandler} from 'src/presentation/contracts/command-handler';

export interface CommandHandlerFactory {
    getHandler(type: CommandHandlerType): CommandHandler;
}

export enum CommandHandlerType {
    DisplayInCalendar,
    NavigateToCurrentWeek,
    NavigateToNextWeek,
    NavigateToPreviousWeek,
    OpenYesterdaysNote,
    OpenTomorrowsNote
}