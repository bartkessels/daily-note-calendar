import {GeneralPeriodNoteViewModel} from 'src/presentation/view-models/general.period-note-view.model';
import {PluginSettings} from 'src/domain/settings/plugin.settings';
import {PeriodService} from 'src/presentation/contracts/period-service';
import {DEFAULT_YEARLY_NOTE_SETTINGS} from 'src/domain/settings/period-note.settings';

export class YearPeriodNoteViewModel extends GeneralPeriodNoteViewModel {
    constructor(periodService: PeriodService) {
        super(DEFAULT_YEARLY_NOTE_SETTINGS, periodService);
    }

    public updateSettings(settings: PluginSettings): void {
        this.settings = settings.yearlyNotes;
    }
}