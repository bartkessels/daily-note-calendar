import {CommandHandler} from 'src/presentation/contracts/command-handler';
import {DateManagerFactory} from 'src/business/contracts/date-manager-factory';
import {PeriodNoteViewModel} from 'src/presentation/contracts/period.view-model';
import { ModifierKey } from 'src/domain/models/modifier-key';
import {CalendarViewModel} from 'src/presentation/contracts/calendar.view-model';

export class OpenYesterdaysNoteCommandHandler implements CommandHandler {
    constructor(
        private readonly dateManagerFactory: DateManagerFactory,
        private readonly viewModel: PeriodNoteViewModel,
        private readonly calendarViewModel: CalendarViewModel
    ) {

    }

    public async execute(): Promise<void> {
        const yesterday = this.dateManagerFactory.getManager().getYesterday();

        this.calendarViewModel.setSelectedPeriod?.call(this, yesterday);
        await this.viewModel.openNote(ModifierKey.None, yesterday);
    }
}