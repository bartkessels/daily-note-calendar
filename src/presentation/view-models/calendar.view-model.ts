import {CalendarUiModel} from 'src/presentation/models/calendar.ui-model';
import {DEFAULT_PLUGIN_SETTINGS, PluginSettings} from 'src/domain/settings/plugin.settings';
import {Period} from 'src/domain/models/period.model';
import {CalendarService} from 'src/presentation/contracts/calendar-service';
import { ModifierKey } from 'src/presentation/models/modifier-key';
import {PeriodUiModel} from 'src/presentation/models/period.ui-model';

export interface CalendarViewModel {
    setUpdateViewState(callback: (model: CalendarUiModel) => void): void;
    initialize(settings: PluginSettings, today: Period): void;
    selectPeriod(period: Period): void;
    openDailyNote(key: ModifierKey, period: PeriodUiModel): Promise<void>;
    openWeeklyNote(key: ModifierKey, period: PeriodUiModel): Promise<void>;
    openMonthlyNote(key: ModifierKey, period: PeriodUiModel): Promise<void>;
    openQuarterlyNote(key: ModifierKey, period: PeriodUiModel): Promise<void>;
    openYearlyNote(key: ModifierKey, period: PeriodUiModel): Promise<void>;
    loadCurrentWeek(): void;
    loadPreviousWeek(): void;
    loadNextWeek(): void;
}

export class DefaultCalendarViewModel implements CalendarViewModel {
    private settings: PluginSettings = DEFAULT_PLUGIN_SETTINGS;
    private uiModel: CalendarUiModel | null = null;
    private updateModel: (uiModel: CalendarUiModel) => void;

    constructor(
        private readonly calendarService: CalendarService
    ) {

    }

    public setUpdateViewState(callback: (model: CalendarUiModel) => void): void {
        this.updateModel = callback;
    }

    private setModel(model: CalendarUiModel): void {
        // Only update the UI model if it's the latest version of the UI model
        if (!this.uiModel || model.lastUpdated > this.uiModel.lastUpdated) {
            this.uiModel = model;
            this.updateModel(model);
        }
    }

    public initialize(settings: PluginSettings, today: Period): void {
        this.settings = settings;
        this.calendarService.initialize(settings, today, (model) => {
            this.setModel(model);
        });
    }

    public selectPeriod(period: Period): void {
        this.calendarService.selectPeriod(this.uiModel, period, (model) => {
            this.setModel(model);
        });
    }

    public loadCurrentWeek() {
        this.calendarService.loadCurrentWeek(this.uiModel, (model) => this.setModel(model));
    }

    public loadPreviousWeek(): void {
        this.calendarService.loadPreviousWeek(this.uiModel, (model) => this.setModel(model));
    }

    public loadNextWeek(): void {
        this.calendarService.loadNextWeek(this.uiModel, (model) => this.setModel(model));
    }

    public async openDailyNote(key: ModifierKey, period: PeriodUiModel): Promise<void> {
        await this.calendarService.openPeriodicNote(this.uiModel, key, period, this.settings.dailyNotes, (model) => {
            this.setModel(model);

            // TODO: Display notes created on this day
        });
    }

    public async openWeeklyNote(key: ModifierKey, period: PeriodUiModel): Promise<void> {
        await this.calendarService.openPeriodicNote(this.uiModel, key, period, this.settings.weeklyNotes, (model) => {
            this.setModel(model);

            // TODO: Display notes created on this week
        });
    }

    public async openMonthlyNote(key: ModifierKey, period: PeriodUiModel): Promise<void> {
        await this.calendarService.openPeriodicNote(this.uiModel, key, period, this.settings.monthlyNotes, (model) => {
            this.setModel(model);

            // TODO: Display notes created in this month
        });
    }

    public async openQuarterlyNote(key: ModifierKey, period: PeriodUiModel): Promise<void> {
        await this.calendarService.openPeriodicNote(this.uiModel, key, period, this.settings.quarterlyNotes, (model) => {
            this.setModel(model);
        });
    }

    public async openYearlyNote(key: ModifierKey, period: PeriodUiModel): Promise<void> {
        await this.calendarService.openPeriodicNote(this.uiModel, key, period, this.settings.yearlyNotes, (model) => {
            this.setModel(model);
        });
    }
}