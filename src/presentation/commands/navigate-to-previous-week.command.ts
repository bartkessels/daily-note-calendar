import {Command} from 'obsidian';
import {CommandHandler} from 'src/presentation/contracts/command-handler';

export class NavigateToPreviousWeekCommand implements Command {
    public id: string = 'dnc-navigate-to-previous-week';
    public name: string = 'Navigate to the previous week';

    constructor(
        private readonly commandHandler: CommandHandler
    ) {

    }

    public callback: (() => any) = (): void => {
        this.commandHandler.execute().then();
    };
}