import {Command} from 'obsidian';
import {CommandHandler} from 'src/presentation/contracts/command-handler';
import {CommandHandlerFactory, CommandHandlerType} from 'src/presentation/contracts/command-handler-factory';

export class NavigateToCurrentWeekCommand implements Command {
    private readonly commandHandler: CommandHandler;

    public id: string = 'dnc-navigate-to-current-week';
    public name: string = 'Navigate to current week';

    constructor(commandHandlerFactory: CommandHandlerFactory) {
        this.commandHandler = commandHandlerFactory.getHandler(CommandHandlerType.NavigateToCurrentWeek);
    }

    public callback: (() => any) = (): void => {
        this.commandHandler.execute().then();
    };
}