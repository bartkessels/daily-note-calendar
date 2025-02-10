import {CalendarUiModel} from 'src/presentation/models/calendar.ui-model';
import {DEFAULT_PLUGIN_SETTINGS, PluginSettings} from 'src/domain/settings/plugin.settings';
import {Period} from 'src/domain/models/period.model';
import {CalendarService} from 'src/presentation/contracts/calendar-service';
import { ModifierKey } from 'src/presentation/models/modifier-key';
import {PeriodUiModel} from 'src/presentation/models/period.ui-model';

export interface CalendarViewModel {
    setUpdateViewState(callback: (model: CalendarUiModel) => void): void;
    initialize(settings: PluginSettings, today: Period): void;
    openDailyNote(model: CalendarUiModel | null, key: ModifierKey, period: PeriodUiModel): Promise<void>;
    openWeeklyNote(model: CalendarUiModel | null, key: ModifierKey, period: PeriodUiModel): Promise<void>;
    openMonthlyNote(model: CalendarUiModel | null, key: ModifierKey, period: PeriodUiModel): Promise<void>;
    openQuarterlyNote(model: CalendarUiModel | null, key: ModifierKey, period: PeriodUiModel): Promise<void>;
    openYearlyNote(model: CalendarUiModel | null, key: ModifierKey, period: PeriodUiModel): Promise<void>;
    loadCurrentWeek(model: CalendarUiModel | null): void;
    loadPreviousWeek(model: CalendarUiModel | null): void;
    loadNextWeek(model: CalendarUiModel | null): void;
}

export class DefaultCalendarViewModel implements CalendarViewModel {
    private settings: PluginSettings = DEFAULT_PLUGIN_SETTINGS;
    private updateModel: (uiModel: CalendarUiModel) => void;

    constructor(
        private readonly calendarService: CalendarService
    ) {

    }

    public setUpdateViewState(callback: (model: CalendarUiModel) => void): void {
        this.updateModel = callback;
    }

    public initialize(settings: PluginSettings, today: Period): void {
        this.settings = settings;
        this.calendarService.initialize(settings, today, (model) => {
            this.updateModel(model);
        });
    }

    public loadCurrentWeek(model: CalendarUiModel | null) {
        this.calendarService.loadCurrentWeek(model, (model) => this.updateModel(model));
    }

    public loadPreviousWeek(model: CalendarUiModel | null): void {
        this.calendarService.loadPreviousWeek(model, (model) => this.updateModel(model));
    }

    public loadNextWeek(model: CalendarUiModel | null): void {
        this.calendarService.loadNextWeek(model, (model) => this.updateModel(model));
    }

    public async openDailyNote(model: CalendarUiModel | null, key: ModifierKey, period: PeriodUiModel): Promise<void> {
        await this.calendarService.openPeriodicNote(model, key, period, this.settings.dailyNotes, (model) => {
            this.updateModel(model);

            // TODO: Display notes created on this day
        });
    }

    public async openWeeklyNote(model: CalendarUiModel | null, key: ModifierKey, period: PeriodUiModel): Promise<void> {
        await this.calendarService.openPeriodicNote(model, key, period, this.settings.weeklyNotes, (model) => {
            this.updateModel(model);

            // TODO: Display notes created on this week
        });
    }

    public async openMonthlyNote(model: CalendarUiModel | null, key: ModifierKey, period: PeriodUiModel): Promise<void> {
        await this.calendarService.openPeriodicNote(model, key, period, this.settings.monthlyNotes, (model) => {
            this.updateModel(model);

            // TODO: Display notes created in this month
        });
    }

    public async openQuarterlyNote(model: CalendarUiModel | null, key: ModifierKey, period: PeriodUiModel): Promise<void> {
        await this.calendarService.openPeriodicNote(model, key, period, this.settings.quarterlyNotes, (model) => {
            this.updateModel(model);
        });
    }

    public async openYearlyNote(model: CalendarUiModel | null, key: ModifierKey, period: PeriodUiModel): Promise<void> {
        await this.calendarService.openPeriodicNote(model, key, period, this.settings.yearlyNotes, (model) => {
            this.updateModel(model);
        });
    }
}