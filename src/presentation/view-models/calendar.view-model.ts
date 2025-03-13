import {CalendarUiModel} from 'src/presentation/models/calendar.ui-model';
import {DEFAULT_PLUGIN_SETTINGS, PluginSettings} from 'src/domain/settings/plugin.settings';
import {Period} from 'src/domain/models/period.model';
import {CalendarService} from 'src/presentation/contracts/calendar-service';
import {ModifierKey} from 'src/presentation/models/modifier-key';
import {PeriodUiModel} from 'src/presentation/models/period.ui-model';
import {CalendarUiModelBuilder} from 'src/presentation/builders/calendar.ui-model.builder';
import {WeekModel} from 'src/domain/models/week.model';

export interface CalendarViewModel {
    setUpdateUiModel(callback: (model: CalendarUiModel) => void): void;
    initialize(settings: PluginSettings, today: Period): void;
    selectPeriod(period: Period): void;
    openDailyNote(key: ModifierKey, period: PeriodUiModel): void;
    openWeeklyNote(key: ModifierKey, period: PeriodUiModel): void;
    openMonthlyNote(key: ModifierKey, period: PeriodUiModel): void;
    openQuarterlyNote(key: ModifierKey, period: PeriodUiModel): void;
    openYearlyNote(key: ModifierKey, period: PeriodUiModel): void;
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

        const weeks = await this.calendarService.getCurrentWeek();
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
        await this.updateWeeks(async (): Promise<CalendarUiModel> => {
            return await this.calendarUiModelBuilder
                .withoutValue()
                .build();
        }, async (_: WeekModel[]): Promise<WeekModel[]> => {
            return this.calendarService.getCurrentWeek();
        });
    }

    public async loadPreviousWeek(): Promise<void> {
        await this.updateWeeks(async (): Promise<CalendarUiModel> => {
            return await this.calendarUiModelBuilder
                .dropLastWeek()
                .build();
        }, async (currentWeeks: WeekModel[]): Promise<WeekModel[]> => {
            return this.calendarService.getPreviousWeek(currentWeeks);
        });
    }

    public async loadNextWeek(): Promise<void> {
        await this.updateWeeks(async (): Promise<CalendarUiModel> => {
            return await this.calendarUiModelBuilder
                .dropFirstWeek()
                .build();
        }, async (currentWeeks: WeekModel[]): Promise<WeekModel[]> => {
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

    public openDailyNote(key: ModifierKey, period: PeriodUiModel): void {
        this.updatePeriodUiModel(period, async (): Promise<void> => {
            await this.calendarService.openPeriodicNote(key, period.period, this.settings.dailyNotes);
        });
    }

    public openWeeklyNote(key: ModifierKey, period: PeriodUiModel): void {
        this.updatePeriodUiModel(period, async (): Promise<void> => {
            await this.calendarService.openPeriodicNote(key, period.period, this.settings.weeklyNotes);
        });
    }

    public openMonthlyNote(key: ModifierKey, period: PeriodUiModel): void {
        this.updatePeriodUiModel(period, async (): Promise<void> => {
            await this.calendarService.openPeriodicNote(key, period.period, this.settings.monthlyNotes);
        });
    }

    public openQuarterlyNote(key: ModifierKey, period: PeriodUiModel): void {
        this.updatePeriodUiModel(period, async (): Promise<void> => {
            await this.calendarService.openPeriodicNote(key, period.period, this.settings.quarterlyNotes);
        });
    }

    public openYearlyNote(key: ModifierKey, period: PeriodUiModel): void {
        this.updatePeriodUiModel(period, async (): Promise<void> => {
            await this.calendarService.openPeriodicNote(key, period.period, this.settings.yearlyNotes);
        });
    }

    private async updateMonth(action: (currentWeeks: WeekModel[]) => Promise<WeekModel[]>): Promise<void> {
        await this.updateWeeks(async (): Promise<CalendarUiModel> => {
            return await this.calendarUiModelBuilder
                .withoutValue()
                .build();
        }, async (currentWeeks): Promise<WeekModel[]> => {
            return await action(currentWeeks);
        });
    }

    private async updateWeeks(loadingAction: () => Promise<CalendarUiModel>, action: (currentWeeks: WeekModel[]) => Promise<WeekModel[]>): Promise<void> {
        const currentWeeks = this.uiModel?.weeks.map(week => week.period);
        if (!currentWeeks) {
            return;
        }

        const loadingUiModel = await loadingAction();
        this.setModel(loadingUiModel);

        const weeks = await action(currentWeeks);
        const uiModel = await this.calendarUiModelBuilder
            .withValue(weeks)
            .build();
        this.setModel(uiModel);
    }

    private updatePeriodUiModel(period: PeriodUiModel, action: () => Promise<void>): void {
        const updatedUiModel = <CalendarUiModel>{...this.uiModel, selectedPeriod: period};
        action().then(() => this.setModel(updatedUiModel));
    }
}