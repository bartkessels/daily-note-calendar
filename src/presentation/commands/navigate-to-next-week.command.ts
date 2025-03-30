import {Command} from 'obsidian';
import {CommandHandler} from 'src/presentation/contracts/command-handler';
import {CommandHandlerFactory, CommandHandlerType} from 'src/presentation/contracts/command-handler-factory';

export class NavigateToNextWeekCommand implements Command {
    private readonly commandHandler: CommandHandler;

    public id: string = 'dnc-navigate-to-next-week';
    public name: string = 'Navigate to the next week';

    constructor(commandHandlerFactory: CommandHandlerFactory) {
        this.commandHandler = commandHandlerFactory.getHandler(CommandHandlerType.NavigateToNextWeek);
    }

    public callback: (() => any) = (): void => {
        this.commandHandler.execute().catch();
    };
}