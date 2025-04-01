import {ModifierKey} from 'src/presentation/models/modifier-key';
import {Period} from 'src/domain/models/period.model';
import {PeriodService} from 'src/presentation/contracts/period-service';
import {DEFAULT_DAILY_NOTE_SETTINGS, PeriodNoteSettings} from 'src/domain/settings/period-note.settings';
import {PluginSettings} from 'src/domain/settings/plugin.settings';

export interface PeriodNoteViewModel {
    initialize(settings: PluginSettings): void;
    openNote(key: ModifierKey, period: Period): Promise<void>;
    openNoteInHorizontalSplitView(key: ModifierKey, period: Period): Promise<void>;
    openNoteInVerticalSplitView(key: ModifierKey, period: Period): Promise<void>;
    deleteNote(period: Period): Promise<void>;
}

export class DailyNotePeriodNoteViewModel implements PeriodNoteViewModel {
    private settings: PeriodNoteSettings = DEFAULT_DAILY_NOTE_SETTINGS;

    constructor(
        private readonly noteService: PeriodService,
    ) {
    }

    public initialize(settings: PluginSettings): void {
        this.settings = settings.dailyNotes;
        this.noteService.initialize(settings);
    }

    public async openNote(key: ModifierKey, period: Period): Promise<void> {
        await this.noteService.openNoteInCurrentTab(key, period, this.settings);
    }
}