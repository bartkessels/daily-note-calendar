import {CommandHandler} from 'src/presentation/contracts/command-handler';
import {NoteManagerFactory} from 'src/business/contracts/note-manager-factory';
import {SettingsRepositoryFactory, SettingsType} from 'src/infrastructure/contracts/settings-repository-factory';
import {DisplayNotesSettings} from 'src/domain/settings/display-notes.settings';
import { CalendarViewModel } from 'src/presentation/contracts/calendar.view-model';

export class DisplayInCalendarCommandHandler implements CommandHandler {
    constructor(
        private readonly noteManagerFactory: NoteManagerFactory,
        private readonly settingssRepositoryFactory: SettingsRepositoryFactory,
        private readonly viewModel: CalendarViewModel
    ) {

    }

    public async execute(): Promise<void> {
        const activeNote = await this.noteManagerFactory.getManager().getActiveNote();
        const settings = await this.settingssRepositoryFactory
            .getRepository<DisplayNotesSettings>(SettingsType.DisplayNotes)
            .get();

        if (!activeNote) {
            return;
        }

        if (settings.useCreatedOnDateFromProperties && activeNote.createdOnProperty) {
            this.viewModel.setSelectedPeriod?.call(this, activeNote.createdOnProperty);
        } else if (!settings.useCreatedOnDateFromProperties) {
            this.viewModel.setSelectedPeriod?.call(this, activeNote.createdOn);
        }
    }
}