import { Command } from 'obsidian';
import { CommandHandler } from 'src/presentation/contracts/command-handler';
import { CommandHandlerFactory, CommandHandlerType } from 'src/presentation/contracts/command-handler-factory';

export class OpenYearlyNoteCommand implements Command {
    private readonly commandHandler: CommandHandler;

    public id: string = 'dnc-open-yearly-note';
    public name: string = 'Open yearly note';

    constructor(commandHandlerFactory: CommandHandlerFactory) {
        this.commandHandler = commandHandlerFactory.getHandler(CommandHandlerType.OpenYearlyNote);
    }

    public callback: (() => void) = (): void => {
        this.commandHandler.execute().catch();
    };
}