import {CommandHandler} from 'src/presentation/contracts/command-handler';
import {DateManager} from 'src/business/contracts/date.manager';
import {DateManagerFactory} from 'src/business/contracts/date-manager-factory';
import {CalendarViewModel} from 'src/presentation/view-models/calendar.view-model';
import {periodUiModel} from 'src/presentation/models/period.ui-model';
import {ModifierKey} from 'src/presentation/models/modifier-key';

export class OpenTomorrowsNoteCommandHandler implements CommandHandler {
    private readonly dateManager: DateManager;

    constructor(
        dateManagerFactory: DateManagerFactory,
        private readonly viewModel: CalendarViewModel
    ) {
        this.dateManager = dateManagerFactory.getManager();
    }

    public async execute(): Promise<void> {
        const tomorrow = this.dateManager.getTomorrow();
        const tomorrowUiModel = periodUiModel(tomorrow);
        await this.viewModel.openDailyNote(ModifierKey.None, tomorrowUiModel);
    }
}