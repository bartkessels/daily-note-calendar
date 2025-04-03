import {CommandHandler} from 'src/presentation/contracts/command-handler';
import {DateManagerFactory} from 'src/business/contracts/date-manager-factory';
import {SettingsRepositoryFactory, SettingsType} from 'src/infrastructure/contracts/settings-repository-factory';
import {GeneralSettings} from 'src/domain/settings/general.settings';
import {ModifierKey} from 'src/domain/models/modifier-key';
import {PeriodNoteViewModel} from 'src/presentation/contracts/period.view-model';

export class OpenWeeklyNoteCommandHandler implements CommandHandler {
    constructor(
        private readonly dateManagerFactory: DateManagerFactory,
        private readonly settingsRepositoryFactory: SettingsRepositoryFactory,
        private readonly viewModel: PeriodNoteViewModel,
    ) {

    }

    public async execute(): Promise<void> {
        const settings = await this.settingsRepositoryFactory
            .getRepository<GeneralSettings>(SettingsType.General)
            .get();

        const today = this.dateManagerFactory.getManager().getCurrentDay();
        const week = this.dateManagerFactory.getManager().getWeek(today, settings.firstDayOfWeek);

        await this.viewModel.openNote(ModifierKey.None, week);
    }
}