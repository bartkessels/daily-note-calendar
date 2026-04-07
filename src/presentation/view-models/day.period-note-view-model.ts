import {GeneralPeriodNoteViewModel} from 'src/presentation/view-models/general.period-note-view.model';
import {PluginSettings} from 'src/domain/settings/plugin.settings';
import {PeriodService} from 'src/presentation/contracts/period-service';
import {DEFAULT_DAILY_NOTE_SETTINGS} from 'src/domain/settings/period-note.settings';
import {MessageAdapter} from 'src/presentation/adapters/message.adapter';
import {DayNoteViewModel} from 'src/presentation/contracts/day.view-model';
import {NoteService} from 'src/presentation/contracts/note-service';
import {Period} from 'src/domain/models/period.model';

export class DayPeriodNoteViewModel extends GeneralPeriodNoteViewModel implements DayNoteViewModel {
    constructor(periodService: PeriodService, messageAdapter: MessageAdapter, private readonly noteService: NoteService) {
        super(DEFAULT_DAILY_NOTE_SETTINGS, periodService, messageAdapter);
    }

    public updateSettings(settings: PluginSettings): void {
        super.updateSettings(settings);
        this.settings = settings.dailyNotes;
    }

    public async getNoteCount(period: Period): Promise<number> {
        if (!this.pluginSettings.generalSettings.displayCreatedNoteCountIndicator) {
            return 0;
        }
        return this.noteService.getNotesForPeriod(period).then(notes => notes.length);
    }
}