import {CalendarUiModel} from 'src/presentation/models/calendar.ui-model';
import {DEFAULT_PLUGIN_SETTINGS, PluginSettings} from 'src/domain/settings/plugin.settings';
import {Period} from 'src/domain/models/period.model';
import {CalendarService} from 'src/presentation/contracts/calendar-service';
import {ModifierKey} from 'src/presentation/models/modifier-key';
import {PeriodUiModel} from 'src/presentation/models/period.ui-model';
import {WeekUiModel} from 'src/presentation/models/week.ui-model';
import {CalendarUiModelBuilder} from 'src/presentation/builders/calendar.ui-model.builder';

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
    private updateUiModel: (state: CalendarUiModel) => void;

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
        const loadingUiModel = await this.calendarUiModelBuilder
            .withoutValue()
            .build();

        this.updateUiModel(loadingUiModel);

        const currentWeek = await this.calendarService.getCurrentWeek();
        const uiModel = await this.calendarUiModelBuilder
            .withValue(currentWeek)
            .build();

        this.setModel(uiModel);
    }

    public async loadPreviousWeek(): Promise<void> {
        const currentWeeks = this.uiModel?.weeks;
        if (!currentWeeks) {
            return;
        }

        const loadingUiModel = await this.calendarUiModelBuilder
            .dropLastWeek()
            .build();
        this.setModel(loadingUiModel);

        const weeks = await this.calendarService.getPreviousWeek(currentWeeks);
        const uiModel = await this.calendarUiModelBuilder
            .withValue(weeks)
            .build();
        this.setModel(uiModel);
    }

    public async loadNextWeek(): Promise<void> {
        const currentWeeks = this.uiModel?.weeks;
        if (!currentWeeks) {
            return;
        }

        const loadingUiModel = await this.calendarUiModelBuilder
            .dropFirstWeek()
            .build();
        this.setModel(loadingUiModel);

        const weeks = await this.calendarService.getNextWeek(currentWeeks);
        const uiModel = await this.calendarUiModelBuilder
            .withValue(weeks)
            .build();
        this.setModel(uiModel);
    }

    public async loadPreviousMonth(): Promise<void> {
        const weeks: WeekUiModel[] | undefined = this.uiModel?.weeks.filter(week => week !== null);
        if (!weeks || weeks.length < 5) {
            return;
        }

        await this.updateWeeks(async (): Promise<WeekUiModel[]> => {
            return await this.calendarService.getPreviousMonth(weeks);
        });
    }

    public async loadNextMonth(): Promise<void> {
        const weeks: WeekUiModel[] | undefined = this.uiModel?.weeks.filter(week => week !== null);
        if (!weeks || weeks.length < 5) {
            return;
        }

        await this.updateWeeks(async (): Promise<WeekUiModel[]> => {
            return await this.calendarService.getNextMonth(weeks);
        });
    }

    public openDailyNote(key: ModifierKey, period: PeriodUiModel): void {
        this.updatePeriodUiModel(period, async (): Promise<void> => {
            await this.calendarService.openPeriodicNote(key, period, this.settings.dailyNotes);
        });
    }

    public openWeeklyNote(key: ModifierKey, period: PeriodUiModel): void {
        this.updatePeriodUiModel(period, async (): Promise<void> => {
            await this.calendarService.openPeriodicNote(key, period, this.settings.weeklyNotes);
        });
    }

    public openMonthlyNote(key: ModifierKey, period: PeriodUiModel): void {
        this.updatePeriodUiModel(period, async (): Promise<void> => {
            await this.calendarService.openPeriodicNote(key, period, this.settings.monthlyNotes);
        });
    }

    public openQuarterlyNote(key: ModifierKey, period: PeriodUiModel): void {
        this.updatePeriodUiModel(period, async (): Promise<void> => {
            await this.calendarService.openPeriodicNote(key, period, this.settings.quarterlyNotes);
        });
    }

    public openYearlyNote(key: ModifierKey, period: PeriodUiModel): void {
        this.updatePeriodUiModel(period, async (): Promise<void> => {
            await this.calendarService.openPeriodicNote(key, period, this.settings.yearlyNotes);
        });
    }

    private async updateWeeks(action: () => Promise<WeekUiModel[]>): Promise<void> {
        const loadingUiModel = await this.calendarUiModelBuilder
            .withoutValue()
            .build();
        this.updateUiModel(loadingUiModel);

        const weeks = await action();
        const uiModel = await this.calendarUiModelBuilder
            .withValue(weeks)
            .build();
        this.updateUiModel(uiModel);
    }

    private updatePeriodUiModel(period: PeriodUiModel, action: () => Promise<void>): void {
        const updatedUiModel = <CalendarUiModel>{...this.uiModel, selectedPeriod: period};
        action().then(() => this.updateUiModel(updatedUiModel));
    }
}