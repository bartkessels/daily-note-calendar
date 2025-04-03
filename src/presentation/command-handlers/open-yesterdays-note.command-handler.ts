import {CommandHandler} from 'src/presentation/contracts/command-handler';
import {DateManagerFactory} from 'src/business/contracts/date-manager-factory';
import {PeriodNoteViewModel} from 'src/presentation/contracts/period.view-model';
import { ModifierKey } from 'src/domain/models/modifier-key';

export class OpenYesterdaysNoteCommandHandler implements CommandHandler {
    constructor(
        private readonly dateManagerFactory: DateManagerFactory,
        private readonly viewModel: PeriodNoteViewModel
    ) {

    }

    public async execute(): Promise<void> {
        const yesterday = this.dateManagerFactory.getManager().getYesterday();
        await this.viewModel.openNote(ModifierKey.None, yesterday);
    }
}