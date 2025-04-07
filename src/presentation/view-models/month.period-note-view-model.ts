import {GeneralPeriodNoteViewModel} from 'src/presentation/view-models/general.period-note-view.model';
import {PluginSettings} from 'src/domain/settings/plugin.settings';
import {PeriodService} from 'src/presentation/contracts/period-service';
import {DEFAULT_MONTHLY_NOTE_SETTINGS} from 'src/domain/settings/period-note.settings';

export class MonthPeriodNoteViewModel extends GeneralPeriodNoteViewModel {
    constructor(periodService: PeriodService) {
        super(DEFAULT_MONTHLY_NOTE_SETTINGS, periodService);
    }

    public updateSettings(settings: PluginSettings): void {
        super.updateSettings(settings);
        this.settings = settings.monthlyNotes;
    }
}