import {CalendarUiModel} from 'src/presentation/models/calendar.ui-model';
import {DEFAULT_PLUGIN_SETTINGS, PluginSettings} from 'src/domain/settings/plugin.settings';
import {Period} from 'src/domain/models/period.model';
import {CalendarService} from 'src/presentation/contracts/calendar-service';
import { ModifierKey } from 'src/presentation/models/modifier-key';
import {PeriodUiModel} from 'src/presentation/models/period.ui-model';
import {CalendarViewState, LoadedCalendarViewState, LoadingCalendarViewState} from 'src/presentation/view-states/calendar.view-state';
import {LoadedPeriodViewState, LoadingPeriodViewState} from 'src/presentation/view-states/period.view-state';

export interface CalendarViewModel {
    setUpdateViewState(callback: (state: CalendarViewState) => void): void;
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
    private setViewState: (state: CalendarViewState) => void;

    constructor(
        private readonly calendarService: CalendarService
    ) {

    }

    public setUpdateViewState(callback: (model: CalendarViewState) => void): void {
        this.setViewState = callback;
    }

    private setModel(model: CalendarUiModel): void {
        // Only update the UI model if it's the latest version of the UI model
        if (!this.uiModel || model.lastUpdateRequest > this.uiModel.lastUpdateRequest) {
            this.uiModel = model;
            this.setViewState(new LoadedCalendarViewState(model));
        }

        console.log(model);
    }

    public initialize(settings: PluginSettings, today: Period): void {
        this.settings = settings;
        this.calendarService.initialize(settings, today, (model) => {
            this.setModel(model);
        });
    }

    public selectPeriod(period: Period): void {
        this.updateUiModel(() => {
            this.calendarService.selectPeriod(this.uiModel, period, this.setModel.bind(this));
        });
    }

    public loadCurrentWeek() {
        this.updateUiModel(() => {
            this.calendarService.loadCurrentWeek(this.uiModel, this.setModel.bind(this));
        });
    }

    public loadPreviousWeek(): void {
        this.updateUiModel(() => {
            this.calendarService.loadPreviousWeek(this.uiModel, this.setModel.bind(this));
        });
    }

    public loadNextWeek(): void {
        this.updateUiModel(() => {
            this.calendarService.loadNextWeek(this.uiModel, this.setModel.bind(this));
        });
    }

    public loadPreviousMonth() {
        this.updateUiModel(() => {
            this.calendarService.loadPreviousMonth(this.uiModel, this.setModel.bind(this));
        });
    }

    public loadNextMonth() {
        this.updateUiModel(() => {
            this.calendarService.loadNextMonth(this.uiModel, this.setModel.bind(this));
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

    public  openYearlyNote(key: ModifierKey, period: PeriodUiModel): void {
        this.updatePeriodUiModel(period, async (): Promise<void> => {
            await this.calendarService.openPeriodicNote(key, period, this.settings.yearlyNotes);
        });
    }

    private updatePeriodUiModel(period: PeriodUiModel, action: () => Promise<void>): void {
        const periodViewState = new LoadingPeriodViewState(period);
        const updatedUiModel = <CalendarUiModel>{ ...this.uiModel, selectedPeriod: periodViewState };
        this.setViewState(new LoadedCalendarViewState(updatedUiModel));

        action().then(() => {
            const loadedPeriod = new LoadedPeriodViewState(period);
            const loadedUiModel = <CalendarUiModel>{ ...this.uiModel, selectedPeriod: loadedPeriod };
            this.setViewState(new LoadedCalendarViewState(loadedUiModel));
        });
    }

    private updateUiModel(action: () => void): void {
        this.setViewState(new LoadingCalendarViewState());
        action();
    }
}