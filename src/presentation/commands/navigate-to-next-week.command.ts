import {Command} from 'obsidian';
import {CommandHandler} from 'src/presentation/contracts/command-handler';

export class NavigateToNextWeekCommand implements Command {
    public id: string = 'dnc-navigate-to-next-week';
    public name: string = 'Navigate to the next week';

    constructor(
        private readonly commandHandler: CommandHandler
    ) {

    }

    public callback: (() => any) = (): void => {
        this.commandHandler.execute().then();
    };
}