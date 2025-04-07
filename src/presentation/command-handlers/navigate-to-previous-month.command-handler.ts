import {CommandHandler} from 'src/presentation/contracts/command-handler';
import {CalendarViewModel} from 'src/presentation/contracts/calendar.view-model';

export class NavigateToPreviousMonthCommandHandler implements CommandHandler {
    constructor(
        private readonly viewModel: CalendarViewModel
    ) {

    }

    public async execute(): Promise<void> {
        this.viewModel.navigateToPreviousMonth?.call(this);
    }
}