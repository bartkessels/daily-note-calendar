import {CommandHandler} from 'src/presentation/contracts/command-handler';
import {DateManagerFactory} from 'src/business/contracts/date-manager-factory';
import {PeriodNoteViewModel} from 'src/presentation/contracts/period.view-model';
import {CalendarViewModel} from 'src/presentation/contracts/calendar.view-model';
import {ModifierKey} from 'src/domain/models/modifier-key';

export class OpenTodaysNoteCommandHandler implements CommandHandler {
    constructor(
        private readonly dateManagerFactory: DateManagerFactory,
        private readonly viewModel: PeriodNoteViewModel,
        private readonly calendarViewModel: CalendarViewModel
    ) {

    }

    public async execute(): Promise<void> {
        const today = this.dateManagerFactory.getManager().getCurrentDay();
        this.calendarViewModel.setSelectedPeriod?.call(this, today);
        await this.viewModel.openNote(ModifierKey.None, today);
    }
}