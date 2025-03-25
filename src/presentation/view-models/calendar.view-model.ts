import {CalendarUiModel} from 'src/presentation/models/calendar.ui-model';
import {DEFAULT_PLUGIN_SETTINGS, PluginSettings} from 'src/domain/settings/plugin.settings';
import {Period} from 'src/domain/models/period.model';
import {CalendarService} from 'src/presentation/contracts/calendar-service';
import {isSelectModifierKey, ModifierKey} from 'src/presentation/models/modifier-key';
import {PeriodUiModel} from 'src/presentation/models/period.ui-model';
import {CalendarUiModelBuilder} from 'src/presentation/builders/calendar.ui-model.builder';
import {WeekModel} from 'src/domain/models/week.model';

export interface CalendarViewModel {
    setUpdateUiModel(callback: (model: CalendarUiModel) => void): void;
    initialize(settings: PluginSettings, today: Period): void;
    selectPeriod(period: Period): Promise<void>;
    openDailyNote(key: ModifierKey, period: PeriodUiModel): Promise<void>;
    deleteDailyNote(period: PeriodUiModel): Promise<void>;
    openWeeklyNote(key: ModifierKey, period: PeriodUiModel): Promise<void>;
    deleteWeeklyNote(period: PeriodUiModel): Promise<void>;
    openMonthlyNote(key: ModifierKey, period: PeriodUiModel): Promise<void>;
    deleteMonthlyNote(period: PeriodUiModel): Promise<void>;
    openQuarterlyNote(key: ModifierKey, period: PeriodUiModel): Promise<void>;
    deleteQuarterlyNote(period: PeriodUiModel): Promise<void>;
    openYearlyNote(key: ModifierKey, period: PeriodUiModel): Promise<void>;
    deleteYearlyNote(period: PeriodUiModel): Promise<void>;
    loadCurrentWeek(): void;
    loadPreviousWeek(): void;
    loadNextWeek(): void;
    loadPreviousMonth(): void;
    loadNextMonth(): void;
}

export class DefaultCalendarViewModel implements CalendarViewModel {
    private settings: PluginSettings = DEFAULT_PLUGIN_SETTINGS;
    private uiModel: CalendarUiModel | null = null;
    private updateUiModel: (model: CalendarUiModel) => void;

    constructor(
        private readonly calendarService: CalendarService,
        private readonly calendarUiModelBuilder: CalendarUiModelBuilder
    ) {

    }

    public setUpdateUiModel(callback: (model: CalendarUiModel) => void): void {
        this.updateUiModel = callback;
    }

    private setModel(model: CalendarUiModel): void {
        // Only update the UI model if it's the latest version of the UI model
        if (!this.uiModel || model.lastUpdateRequest > this.uiModel.lastUpdateRequest) {
            this.uiModel = model;
            this.updateUiModel(model);
        }
    }

    public async initialize(settings: PluginSettings, today: Period): Promise<void> {
        this.settings = settings;
        this.calendarService.initialize(settings);
        this.calendarUiModelBuilder.withSettings(settings);

        const weeks = this.calendarService.getCurrentWeek();
        const uiModel = await this.calendarUiModelBuilder
            .withToday(today)
            .withValue(weeks)
            .build();

        this.setModel(uiModel);
    }

    public async selectPeriod(period: Period): Promise<void> {
        const uiModel = await this.calendarUiModelBuilder
            .withSelectedPeriod(period)
            .build();

        this.setModel(uiModel);
    }

    public async loadCurrentWeek(): Promise<void> {
        await this.updateWeeks(async (_: WeekModel[]): Promise<WeekModel[]> => {
            return this.calendarService.getCurrentWeek();
        });
    }

    public async loadPreviousWeek(): Promise<void> {
        await this.updateWeeks(async (currentWeeks: WeekModel[]): Promise<WeekModel[]> => {
            return this.calendarService.getPreviousWeek(currentWeeks);
        });
    }

    public async loadNextWeek(): Promise<void> {
        await this.updateWeeks(async (currentWeeks: WeekModel[]): Promise<WeekModel[]> => {
            return this.calendarService.getNextWeek(currentWeeks);
        });
    }

    public async loadPreviousMonth(): Promise<void> {
        const weeks = this.uiModel?.weeks.map(week => week.period);
        if (!weeks) {
            return;
        }

        await this.updateMonth(async (): Promise<WeekModel[]> => {
            return this.calendarService.getPreviousMonth(weeks);
        });
    }

    public async loadNextMonth(): Promise<void> {
        const weeks = this.uiModel?.weeks.map(week => week.period);
        if (!weeks) {
            return;
        }

        await this.updateMonth(async (): Promise<WeekModel[]> => {
            return this.calendarService.getNextMonth(weeks);
        });
    }

    public async openDailyNote(key: ModifierKey, period: PeriodUiModel): Promise<void> {
        await this.updatePeriodUiModel(period, async (): Promise<void> => {
            if (!isSelectModifierKey(key)) {
                await this.calendarService.openPeriodicNote(key, period.period, this.settings.dailyNotes);
            }
        });
    }

    public async deleteDailyNote(period: PeriodUiModel): Promise<void> {
        await this.updateWeeks(async (weeks: WeekModel[]): Promise<WeekModel[]> => {
            await this.calendarService.deletePeriodicNote(period.period, this.settings.dailyNotes);
            return weeks;
        });
    }

    public async openWeeklyNote(key: ModifierKey, period: PeriodUiModel): Promise<void> {
        await this.updatePeriodUiModel(period, async (): Promise<void> => {
            if (!isSelectModifierKey(key)) {
                await this.calendarService.openPeriodicNote(key, period.period, this.settings.weeklyNotes);
            }
        });
    }

    public async deleteWeeklyNote(period: PeriodUiModel): Promise<void> {
        await this.updateWeeks(async (weeks: WeekModel[]): Promise<WeekModel[]> => {
            await this.calendarService.deletePeriodicNote(period.period, this.settings.weeklyNotes);
            return weeks;
        });
    }

    public async openMonthlyNote(key: ModifierKey, period: PeriodUiModel): Promise<void> {
        await this.updatePeriodUiModel(period, async (): Promise<void> => {
            await this.calendarService.openPeriodicNote(key, period.period, this.settings.monthlyNotes);
        });
    }

    public async deleteMonthlyNote(period: PeriodUiModel): Promise<void> {
        await this.updateWeeks(async (weeks: WeekModel[]): Promise<WeekModel[]> => {
            await this.calendarService.deletePeriodicNote(period.period, this.settings.monthlyNotes);
            return weeks;
        });
    }

    public async openQuarterlyNote(key: ModifierKey, period: PeriodUiModel): Promise<void> {
        await this.updatePeriodUiModel(period, async (): Promise<void> => {
            await this.calendarService.openPeriodicNote(key, period.period, this.settings.quarterlyNotes);
        });
    }

    public async deleteQuarterlyNote(period: PeriodUiModel): Promise<void> {
        await this.updateWeeks(async (weeks: WeekModel[]): Promise<WeekModel[]> => {
            await this.calendarService.deletePeriodicNote(period.period, this.settings.quarterlyNotes);
            return weeks;
        });
    }

    public async openYearlyNote(key: ModifierKey, period: PeriodUiModel): Promise<void> {
        await this.updatePeriodUiModel(period, async (): Promise<void> => {
            await this.calendarService.openPeriodicNote(key, period.period, this.settings.yearlyNotes);
        });
    }

    public async deleteYearlyNote(period: PeriodUiModel): Promise<void> {
        await this.updateWeeks(async (weeks: WeekModel[]): Promise<WeekModel[]> => {
            await this.calendarService.deletePeriodicNote(period.period, this.settings.yearlyNotes);
            return weeks;
        });
    }

    private async updateMonth(action: (currentWeeks: WeekModel[]) => Promise<WeekModel[]>): Promise<void> {
        await this.updateWeeks(async (currentWeeks): Promise<WeekModel[]> => {
            return await action(currentWeeks);
        });
    }

    private async updateWeeks(action: (currentWeeks: WeekModel[]) => Promise<WeekModel[]>): Promise<void> {
        const currentWeeks = this.uiModel?.weeks.map(week => week.period);
        if (!currentWeeks) {
            return;
        }

        const weeks = await action(currentWeeks);
        const uiModel = await this.calendarUiModelBuilder
            .withValue(weeks)
            .build();
        this.setModel(uiModel);
    }

    private async updatePeriodUiModel(period: PeriodUiModel, action: () => Promise<void>): Promise<void> {
        const uiModel = await this.calendarUiModelBuilder
            .withSelectedPeriod(period.period)
            .build();

        action().then(() => this.setModel(uiModel));
    }
}