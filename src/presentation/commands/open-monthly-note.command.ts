import { Command } from 'obsidian';
import { CommandHandler } from 'src/presentation/contracts/command-handler';
import { CommandHandlerFactory, CommandHandlerType } from 'src/presentation/contracts/command-handler-factory';

export class OpenMonthlyNoteCommand implements Command {
    private readonly commandHandler: CommandHandler;

    public id: string = 'dnc-open-monthly-note';
    public name: string = 'Open monthly note';

    constructor(commandHandlerFactory: CommandHandlerFactory) {
        this.commandHandler = commandHandlerFactory.getHandler(CommandHandlerType.OpenMonthlyNote);
    }

    public callback: (() => void) = (): void => {
        this.commandHandler.execute().catch();
    };
}