import {Command} from 'obsidian';
import {CommandHandler} from 'src/presentation/contracts/command-handler';
import {CommandHandlerFactory, CommandHandlerType} from 'src/presentation/contracts/command-handler-factory';

export class NavigateToPreviousWeekCommand implements Command {
    private readonly commandHandler: CommandHandler;

    public id: string = 'dnc-navigate-to-previous-week';
    public name: string = 'Navigate to the previous week';

    constructor(commandHandlerFactory: CommandHandlerFactory) {
        this.commandHandler = commandHandlerFactory.getHandler(CommandHandlerType.NavigateToPreviousWeek);
    }

    public callback: (() => any) = (): void => {
        this.commandHandler.execute().catch();
    };
}