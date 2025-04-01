import {PeriodNoteViewModel} from 'src/presentation/contracts/period.view-model';
import {PeriodNoteSettings} from 'src/domain/settings/period-note.settings';
import {PeriodUiModel} from 'src/presentation/models/period.ui-model';
import {PeriodService} from 'src/presentation/contracts/period-service';
import {PluginSettings} from 'src/domain/settings/plugin.settings';
import {Period} from 'src/domain/models/period.model';
import {ModifierKey} from 'src/presentation/models/modifier-key';

export abstract class GeneralPeriodNoteViewModel implements PeriodNoteViewModel {
    protected settings: PeriodNoteSettings;
    private updateUiModel: ((model: PeriodUiModel) => void) | null;

    protected constructor(
        initialSettings: PeriodNoteSettings,
        private readonly periodService: PeriodService
    ) {
        this.settings = initialSettings;
    }

    public abstract updateSettings(settings: PluginSettings): void;

    public async initialize(period: Period): Promise<void> {
        this.updateUiModel?.call({period: period, hasPeriodNote: false});
        const hasPeriodicNote = await this.periodService.hasPeriodicNote(period, this.settings);
        this.updateUiModel?.call({period: period, hasPeriodNote: hasPeriodicNote});
    }

    public setUpdateUiModel(updateUiModel: (model: PeriodUiModel) => void): void {
        this.updateUiModel = updateUiModel;
    }

    public async openNote(key: ModifierKey, period: Period): Promise<void> {
        await this.periodService.openNoteInCurrentTab(key, period, this.settings);
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