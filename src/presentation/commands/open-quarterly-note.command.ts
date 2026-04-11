import { Command } from 'obsidian';
import { CommandHandler } from 'src/presentation/contracts/command-handler';
import { CommandHandlerFactory, CommandHandlerType } from '../contracts/command-handler-factory';

export class OpenQuarterlyNoteCommand implements Command {
    private readonly commandHandler: CommandHandler;

    public id: string = 'dnc-open-quarterly-note';
    public name: string = 'Open quarterly note';

    constructor(commandHandlerFactory: CommandHandlerFactory) {
        this.commandHandler = commandHandlerFactory.getHandler(CommandHandlerType.OpenQuarterlyNote);
    }

    public callback: (() => void) = (): void => {
        this.commandHandler.execute().catch();
    };
}