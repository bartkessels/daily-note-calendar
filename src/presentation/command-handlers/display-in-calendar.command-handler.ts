import {CalendarViewModel} from 'src/presentation/view-models/calendar.view-model';
import {CommandHandler} from 'src/presentation/contracts/command-handler';
import {NoteManagerFactory} from 'src/business/contracts/note-manager-factory';

export class DisplayInCalendarCommandHandler implements CommandHandler {
    constructor(
        private readonly noteManagerFactory: NoteManagerFactory,
        private readonly viewModel: CalendarViewModel
    ) {

    }

    public async execute(): Promise<void> {
        const activeNote = await this.noteManagerFactory.getManager().getActiveNote();

        if (activeNote?.createdOn) {
            this.viewModel.selectPeriod(activeNote.createdOn);
        }
    }
}