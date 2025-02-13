import {CommandHandler} from 'src/presentation/contracts/command-handler';
import {DateManagerFactory} from 'src/business/contracts/date-manager-factory';
import {DateManager} from 'src/business/contracts/date.manager';
import {CalendarViewModel} from 'src/presentation/view-models/calendar.view-model';
import {ModifierKey} from 'src/presentation/models/modifier-key';
import {periodUiModel} from 'src/presentation/models/period.ui-model';

export class OpenYesterdaysNoteCommandHandler implements CommandHandler {
    private readonly dateManager: DateManager;

    constructor(
        dateManagerFactory: DateManagerFactory,
        private readonly viewModel: CalendarViewModel
    ) {
        this.dateManager = dateManagerFactory.getManager();
    }

    public async execute(): Promise<void> {
        const yesterday = this.dateManager.getYesterday();
        const yesterdayUiModel = periodUiModel(yesterday);
        await this.viewModel.openDailyNote(ModifierKey.None, yesterdayUiModel);
    }
}