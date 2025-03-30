import {Command} from 'obsidian';
import {CommandHandler} from 'src/presentation/contracts/command-handler';
import {CommandHandlerFactory, CommandHandlerType} from 'src/presentation/contracts/command-handler-factory';

export class DisplayInCalendarCommand implements Command {
    private readonly commandHandler: CommandHandler;

    public id: string = 'dnc-display-in-calendar';
    public name: string = 'Display the current note in the calendar';

    constructor(commandHandlerFactory: CommandHandlerFactory) {
        this.commandHandler = commandHandlerFactory.getHandler(CommandHandlerType.DisplayInCalendar);
    }

    public callback: (() => any) = (): void => {
        this.commandHandler.execute().catch();
    }
}