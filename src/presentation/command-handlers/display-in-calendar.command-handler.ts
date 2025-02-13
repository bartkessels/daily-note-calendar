import {SettingsRepositoryFactory, SettingsType} from 'src/infrastructure/contracts/settings-repository-factory';
import {DisplayNotesSettings} from 'src/domain/settings/display-notes.settings';
import {CalendarViewModel} from 'src/presentation/view-models/calendar.view-model';
import {CommandHandler} from 'src/presentation/contracts/command-handler';
import {NoteManagerFactory} from 'src/business/contracts/note-manager-factory';

export class DisplayInCalendarCommandHandler implements CommandHandler {
    constructor(
        private readonly noteManagerFactory: NoteManagerFactory,
        private readonly settingsRepositoryFactory: SettingsRepositoryFactory,
        private readonly viewModel: CalendarViewModel
    ) {

    }

    public async execute(): Promise<void> {
        const activeNote = await this.noteManagerFactory.getManager().getActiveNote();
        const settings = await this.settingsRepositoryFactory
            .getRepository<DisplayNotesSettings>(SettingsType.DisplayNotes)
            .get();

        if (settings.useCreatedOnDateFromProperties && activeNote?.createdOnProperty) {
            this.viewModel.selectPeriod(activeNote.createdOnProperty);
        } else if (activeNote?.createdOn) {
            this.viewModel.selectPeriod(activeNote?.createdOn)
        }
    }
}