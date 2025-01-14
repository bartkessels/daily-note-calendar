import {Command} from 'obsidian';
import {CommandHandler} from 'src/domain/command-handlers/command-handler';

export class DisplayInCalendarCommand implements Command {
    public id: string = 'dnc-display-in-calendar';
    public name: string = 'Display the current note in the calendar';

    constructor(
        private readonly commandHandler: CommandHandler
    ) {

    }

    public callback: (() => any) = (): void => {
        this.commandHandler.execute().then();
    };
}