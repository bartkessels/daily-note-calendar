import {PeriodService} from 'src/presentation/contracts/period-service';
import {PeriodicNoteManager} from 'src/business/contracts/periodic-note.manager';
import {isCreateFileModifierKey, ModifierKey} from 'src/presentation/models/modifier-key';
import {Period} from 'src/domain/models/period.model';
import {PeriodNoteSettings} from 'src/domain/settings/period-note.settings';
import {DEFAULT_PLUGIN_SETTINGS, PluginSettings} from 'src/domain/settings/plugin.settings';

export class DefaultPeriodService implements PeriodService {
    private settings: PluginSettings = DEFAULT_PLUGIN_SETTINGS;

    constructor(
        private readonly periodicNoteManager: PeriodicNoteManager
    ) {

    }

    public async initialize(settings: PluginSettings): Promise<void> {
        this.settings = settings;
    }

    public async openNoteInCurrentTab(key: ModifierKey, period: Period, settings: PeriodNoteSettings): Promise<void> {
        await this.openNote(key, period, settings, this.periodicNoteManager.openNote.bind(this));
    }

    public async openNoteInHorizontalSplitView(key: ModifierKey, period: Period, settings: PeriodNoteSettings): Promise<void> {
        await this.openNote(key, period, settings, this.periodicNoteManager.openNoteInHorizontalSplitView.bind(this));
    }

    public async openNoteInVerticalSplitView(key: ModifierKey, period: Period, settings: PeriodNoteSettings): Promise<void> {
        await this.openNote(key, period, settings, this.periodicNoteManager.openNoteInVerticalSplitView.bind(this));
    }

    public async deleteNote(period: Period, settings: PeriodNoteSettings): Promise<void> {
        await this.periodicNoteManager.deleteNote(settings, period);
    }

    public async hasPeriodicNote(period: Period, settings: PeriodNoteSettings): Promise<boolean> {
        return await this.periodicNoteManager.doesNoteExist(settings, period);
    }

    private async openNote(
        key: ModifierKey,
        period: Period,
        settings: PeriodNoteSettings,
        openAction: (settings: PeriodNoteSettings, period: Period) => Promise<void>
    ): Promise<void> {
        const requireModifierKeyForCreatingNote = this.settings.generalSettings.useModifierKeyToCreateNote;
        const isCreateFileModifierKeyPressed = isCreateFileModifierKey(key) && requireModifierKeyForCreatingNote;
        const shouldCreateNote = (!requireModifierKeyForCreatingNote || isCreateFileModifierKeyPressed);

        if (shouldCreateNote) {
            await this.periodicNoteManager.createNote(settings, period);
            await openAction(settings, period);
        } else {
            await openAction(settings, period);
        }
    }
}