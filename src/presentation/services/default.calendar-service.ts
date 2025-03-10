import {DEFAULT_PLUGIN_SETTINGS, PluginSettings} from 'src/domain/settings/plugin.settings';
import {CalendarService} from 'src/presentation/contracts/calendar-service';
import {DateManager} from 'src/business/contracts/date.manager';
import {PeriodicNoteManager} from 'src/business/contracts/periodic-note.manager';
import {WeekUiModel} from 'src/presentation/models/week.ui-model';
import {isCreateFileModifierKey, ModifierKey} from 'src/presentation/models/modifier-key';
import {PeriodNoteSettings} from 'src/domain/settings/period-note.settings';
import {PeriodUiModel} from 'src/presentation/models/period.ui-model';
import {DateManagerFactory} from 'src/business/contracts/date-manager-factory';
import {WeekUiModelBuilder} from 'src/presentation/builders/week-ui-model-builder';
import {WeekModel} from 'src/domain/models/week.model';

export class DefaultCalendarService implements CalendarService {
    private readonly dateManager: DateManager;
    private settings: PluginSettings = DEFAULT_PLUGIN_SETTINGS;

    constructor(
        private readonly dateManagerFactory: DateManagerFactory,
        private readonly periodicNoteManager: PeriodicNoteManager,
        private readonly weekUiModelBuilder: WeekUiModelBuilder
    ) {
        this.dateManager = this.dateManagerFactory.getManager();
    }

    public initialize(settings: PluginSettings): void {
        this.settings = settings;
        this.weekUiModelBuilder.withSettings(this.settings);
    }

    public async openPeriodicNote(
        key: ModifierKey,
        period: PeriodUiModel,
        settings: PeriodNoteSettings
    ): Promise<void> {
        const requireModifierKeyForCreatingNote = this.settings.generalSettings.useModifierKeyToCreateNote;
        const isCreateFileModifierKeyPressed = isCreateFileModifierKey(key) && requireModifierKeyForCreatingNote;
        const shouldCreateNote = !requireModifierKeyForCreatingNote || isCreateFileModifierKeyPressed;

        if (shouldCreateNote) {
            await this.periodicNoteManager.createNote(settings, period.period);
            await this.periodicNoteManager.openNote(settings, period.period);
        } else {
            await this.periodicNoteManager.openNote(settings, period.period);
        }
    }

    public async getCurrentWeek(): Promise<WeekUiModel[]> {
        const firstDayOfWeek = this.settings.generalSettings.firstDayOfWeek;
        const currentWeek = this.dateManager.getCurrentWeek(firstDayOfWeek);

        const previousWeeks = this.dateManager.getPreviousWeeks(firstDayOfWeek, currentWeek, 2);
        const nextWeeks = this.dateManager.getNextWeeks(firstDayOfWeek, currentWeek, 2);
        const weeks = [...previousWeeks, currentWeek, ...nextWeeks];

        return await this.buildUiModels(weeks);
    }

    public async getPreviousWeek(weeks: WeekUiModel[]): Promise<WeekUiModel[]> {
        const firstDayOfWeek = this.settings.generalSettings.firstDayOfWeek;
        const middleWeek = this.getMiddleWeek(weeks).period;
        const previousWeeks = this.dateManager.getPreviousWeeks(firstDayOfWeek, middleWeek, 3);
        const nextWeeks = this.dateManager.getNextWeeks(firstDayOfWeek, middleWeek, 1);

        return await this.buildWeeks(previousWeeks, middleWeek, nextWeeks);
    }

    public async getNextWeek(weeks: WeekUiModel[]): Promise<WeekUiModel[]> {
        const firstDayOfWeek = this.settings.generalSettings.firstDayOfWeek;
        const middleWeek = this.getMiddleWeek(weeks).period;
        const previousWeeks = this.dateManager.getPreviousWeeks(firstDayOfWeek, middleWeek, 1);
        const nextWeeks = this.dateManager.getNextWeeks(firstDayOfWeek, middleWeek, 3);

        return await this.buildWeeks(previousWeeks, middleWeek, nextWeeks);
    }

    public async getPreviousMonth(weeks: WeekUiModel[]): Promise<WeekUiModel[]> {
        const middleWeek = this.getMiddleWeek(weeks);
        const firstDayOfWeek = this.settings.generalSettings.firstDayOfWeek;
        const previousMonth = this.dateManager.getPreviousMonth(middleWeek.period, firstDayOfWeek);

        return await this.buildUiModels(previousMonth);
    }

    public async getNextMonth(weeks: WeekUiModel[]): Promise<WeekUiModel[]> {
        const middleWeek = this.getMiddleWeek(weeks);
        const firstDayOfWeek = this.settings.generalSettings.firstDayOfWeek;
        const nextMonth = this.dateManager.getNextMonth(middleWeek.period, firstDayOfWeek);

        return await this.buildUiModels(nextMonth);
    }

    private getMiddleWeek(weeks: WeekUiModel[]): WeekUiModel {
        return weeks[Math.ceil(weeks.length / 2)];
    }

    private async buildWeeks(previousWeeks: WeekModel[], currentWeek: WeekModel, nextWeeks: WeekModel[]): Promise<WeekUiModel[]> {
        const weeks = [...previousWeeks, currentWeek, ...nextWeeks];
        return await this.buildUiModels(weeks);
    }

    private async buildUiModels(weeks: WeekModel[]): Promise<WeekUiModel[]> {
        const uiModels = await Promise.all(weeks.map(async week => await this.weekUiModelBuilder.withValue(week).build()));
        return uiModels.sort((a, b) => a.period.date.getTime() - b.period.date.getTime());
    }
}