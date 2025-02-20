import {Command} from 'obsidian';
import {CommandHandler} from 'src/presentation/contracts/command-handler';
import {CommandHandlerFactory, CommandHandlerType} from 'src/presentation/contracts/command-handler-factory';

export class NavigateToPreviousMonthCommand implements Command {
    private readonly commandHandler: CommandHandler;

    public id: string = 'dnc-navigate-to-previous-month';
    public name: string = 'Navigate to the previous month';

    constructor(commandHandlerFactory: CommandHandlerFactory) {
        this.commandHandler = commandHandlerFactory.getHandler(CommandHandlerType.NavigateToPreviousMonth);
    }

    public callback: (() => any) = (): void => {
        this.commandHandler.execute().then();
    };
}