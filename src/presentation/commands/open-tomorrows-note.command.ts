import {Command} from 'obsidian';
import {CommandHandler} from 'src/presentation/contracts/command-handler';
import {CommandHandlerFactory, CommandHandlerType} from 'src/presentation/contracts/command-handler-factory';

export class OpenTomorrowsNoteCommand implements Command {
    private readonly commandHandler: CommandHandler;

    public id: string = 'dnc-open-tomorrows-note';
    public name: string = `Open Tomorrow's note`;

    constructor(commandHandlerFactory: CommandHandlerFactory) {
        this.commandHandler = commandHandlerFactory.getHandler(CommandHandlerType.OpenTomorrowsNote);
    }

    public callback: (() => any) = (): void => {
        this.commandHandler.execute().then();
    }
}