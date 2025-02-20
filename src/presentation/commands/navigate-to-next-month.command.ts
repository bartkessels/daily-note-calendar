import {Command} from 'obsidian';
import {CommandHandler} from 'src/presentation/contracts/command-handler';
import {CommandHandlerFactory, CommandHandlerType} from 'src/presentation/contracts/command-handler-factory';

export class NavigateToNextMonthCommand implements Command {
    private readonly commandHandler: CommandHandler;

    public id: string = 'dnc-navigate-to-next-month';
    public name: string = 'Navigate to the next month';

    constructor(commandHandlerFactory: CommandHandlerFactory) {
        this.commandHandler = commandHandlerFactory.getHandler(CommandHandlerType.NavigateToNextMonth);
    }

    public callback: (() => any) = (): void => {
        this.commandHandler.execute().then();
    };
}