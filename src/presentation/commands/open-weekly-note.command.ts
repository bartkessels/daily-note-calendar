import {Command} from 'obsidian';
import {CommandHandler} from 'src/presentation/contracts/command-handler';
import {CommandHandlerFactory, CommandHandlerType} from 'src/presentation/contracts/command-handler-factory';

export class OpenWeeklyNoteCommand implements Command {
    private readonly commandHandler: CommandHandler;

    public id: string = 'dnc-open-weekly-note';
    public name: string = 'Open weekly note';

    constructor(commandHandlerFactory: CommandHandlerFactory) {
        this.commandHandler = commandHandlerFactory.getHandler(CommandHandlerType.OpenWeeklyNote);
    }

    public callback: (() => any) = (): void => {
        this.commandHandler.execute().then();
    }
}