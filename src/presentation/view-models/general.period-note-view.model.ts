import {PeriodNoteViewModel} from 'src/presentation/contracts/period.view-model';
import {PeriodNoteSettings} from 'src/domain/settings/period-note.settings';
import {PeriodService} from 'src/presentation/contracts/period-service';
import {DEFAULT_PLUGIN_SETTINGS, PluginSettings} from 'src/domain/settings/plugin.settings';
import {Period} from 'src/domain/models/period.model';
import {ModifierKey} from 'src/domain/models/modifier-key';

export abstract class GeneralPeriodNoteViewModel implements PeriodNoteViewModel {
    protected settings: PeriodNoteSettings;
    protected pluginSettings: PluginSettings = DEFAULT_PLUGIN_SETTINGS;

    protected constructor(
        initialSettings: PeriodNoteSettings,
        private readonly periodService: PeriodService
    ) {
        this.settings = initialSettings;
    }

    public updateSettings(settings: PluginSettings): void {
        this.pluginSettings = settings;
        this.periodService.initialize(settings);
    }

    public async hasPeriodicNote(period: Period): Promise<boolean> {
        const shouldDisplayNoteIndicator = this.pluginSettings.generalSettings.displayNoteIndicator;
        const hasPeriodicNote = await this.periodService.hasPeriodicNote(period, this.settings);

        return shouldDisplayNoteIndicator && hasPeriodicNote;
    }

    public async openNote(key: ModifierKey, period: Period): Promise<void> {
        if (key === ModifierKey.MetaAlt) {
            await this.periodService.openNoteInHorizontalSplitView(key, period, this.settings);
        } else {
            await this.periodService.openNoteInCurrentTab(key, period, this.settings);
        }
    }

    public async openNoteInHorizontalSplitView(key: ModifierKey, period: Period): Promise<void> {
        await this.periodService.openNoteInHorizontalSplitView(key, period, this.settings);
    }

    public async openNoteInVerticalSplitView(key: ModifierKey, period: Period): Promise<void> {
        await this.periodService.openNoteInVerticalSplitView(key, period, this.settings);
    }

    public async deleteNote(period: Period): Promise<void> {
        await this.periodService.deleteNote(period, this.settings);
    }
}