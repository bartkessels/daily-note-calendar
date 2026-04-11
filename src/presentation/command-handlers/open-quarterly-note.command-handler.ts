import { DateManagerFactory } from 'src/business/contracts/date-manager-factory';
import { CommandHandler } from 'src/presentation/contracts/command-handler';
import { SettingsRepositoryFactory, SettingsType } from 'src/infrastructure/contracts/settings-repository-factory';
import { PeriodNoteViewModel } from 'src/presentation/contracts/period.view-model';
import { CalendarViewModel } from 'src/presentation/contracts/calendar.view-model';
import { ModifierKey } from 'src/domain/models/modifier-key';
import { GeneralSettings } from 'src/domain/settings/general.settings';

export class OpenQuarterlyNoteCommandHandler implements CommandHandler {
    constructor(
        private readonly dateManagerFactory: DateManagerFactory,
        private readonly settingsRepositoryFactory: SettingsRepositoryFactory,
        private readonly viewModel: PeriodNoteViewModel,
        private readonly calendarViewModel: CalendarViewModel,
    ) {

    }

    public async execute(): Promise<void> {
        const settings = await this.settingsRepositoryFactory
            .getRepository<GeneralSettings>(SettingsType.General)
            .get();
        
        const today = this.dateManagerFactory.getManager().getCurrentDay();
        const week = this.dateManagerFactory.getManager()
            .getWeek(today, settings.firstDayOfWeek, settings.weekNumberStandard);

        this.calendarViewModel.setSelectedPeriod(week.quarter);
        await this.viewModel.openNote(ModifierKey.None, week.quarter);
    }
}