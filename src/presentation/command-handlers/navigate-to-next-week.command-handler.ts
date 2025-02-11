import {CommandHandler} from 'src/presentation/contracts/command-handler';
import {CalendarViewModel} from 'src/presentation/view-models/calendar.view-model';

export class NavigateToNextWeekCommandHandler implements CommandHandler {
    constructor(
        private readonly viewModel: CalendarViewModel
    ) {

    }

    public async execute(): Promise<void> {
        this.viewModel.loadNextWeek();
    }
}