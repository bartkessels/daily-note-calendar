import {GeneralPeriodNoteViewModel} from 'src/presentation/view-models/general.period-note-view.model';
import {PluginSettings} from 'src/domain/settings/plugin.settings';
import {PeriodService} from 'src/presentation/contracts/period-service';
import {DEFAULT_WEEKLY_NOTE_SETTINGS} from 'src/domain/settings/period-note.settings';
import {MessageAdapter} from 'src/presentation/adapters/message.adapter';

export class WeekPeriodNoteViewModel extends GeneralPeriodNoteViewModel {
    constructor(periodService: PeriodService, messageAdapter: MessageAdapter) {
        super(DEFAULT_WEEKLY_NOTE_SETTINGS, periodService, messageAdapter);
    }

    public updateSettings(settings: PluginSettings): void {
        super.updateSettings(settings);
        this.settings = settings.weeklyNotes;
    }
}