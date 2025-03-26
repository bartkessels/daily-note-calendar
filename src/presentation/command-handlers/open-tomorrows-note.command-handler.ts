import {CommandHandler} from 'src/presentation/contracts/command-handler';
import {DateManagerFactory} from 'src/business/contracts/date-manager-factory';
import {CalendarViewModel} from 'src/presentation/view-models/calendar.view-model';
import {ModifierKey} from 'src/presentation/models/modifier-key';

export class OpenTomorrowsNoteCommandHandler implements CommandHandler {
    constructor(
        private readonly dateManagerFactory: DateManagerFactory,
        private readonly viewModel: CalendarViewModel
    ) {

    }

    public async execute(): Promise<void> {
        const tomorrow = this.dateManagerFactory.getManager().getTomorrow();
        await this.viewModel.openDailyNote(ModifierKey.None, tomorrow);
    }
}