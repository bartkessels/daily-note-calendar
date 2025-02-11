import {Command} from 'obsidian';
import {CommandHandler} from 'src/presentation/contracts/command-handler';

export class NavigateToCurrentWeekCommand implements Command {
    public id: string = 'dnc-navigate-to-current-week';
    public name: string = 'Navigate to current week';

    constructor(
        private readonly commandHandler: CommandHandler
    ) {

    }

    public callback: (() => any) = (): void => {
        this.commandHandler.execute().then();
    };
}