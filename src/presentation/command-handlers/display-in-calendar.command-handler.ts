import {NoteManager} from 'src/business/contracts/note.manager';
import {SettingsRepositoryFactory, SettingsType} from 'src/infrastructure/contracts/settings-repository-factory';
import {DisplayNotesSettings} from 'src/domain/settings/display-notes.settings';
import {SettingsRepository} from 'src/infrastructure/contracts/settings-repository';
import {CalendarViewModel} from 'src/presentation/view-models/calendar.view-model';
import {CommandHandler} from 'src/presentation/contracts/command-handler';

export class DisplayInCalendarCommandHandler implements CommandHandler {
    private readonly settingsRepository: SettingsRepository<DisplayNotesSettings>;

    constructor(
        private readonly noteManager: NoteManager,
        private readonly viewModel: CalendarViewModel,
        settingsRepositoryFactory: SettingsRepositoryFactory
    ) {
        this.settingsRepository = settingsRepositoryFactory.getRepository<DisplayNotesSettings>(SettingsType.DisplayNotes);
    }

    public async execute(): Promise<void> {
        const activeNote = await this.noteManager.getActiveNote();
        const settings = await this.settingsRepository.get();

        if (settings.useCreatedOnDateFromProperties && activeNote?.createdOnProperty) {
            this.viewModel.selectPeriod(activeNote.createdOnProperty);
        } else if (activeNote?.createdOn) {
            this.viewModel.selectPeriod(activeNote?.createdOn)
        }
    }
}