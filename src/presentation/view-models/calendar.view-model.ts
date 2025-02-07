import {calendarUiModel, CalendarUiModel} from 'src/presentation/models/calendar.ui-model';
import {DEFAULT_PLUGIN_SETTINGS, PluginSettings} from 'src/domain/settings/plugin.settings';
import {Period} from 'src/domain/models/period.model';
import {CalendarService} from 'src/presentation/contracts/calendar-service';
import { ModifierKey } from 'src/presentation/models/modifier-key';

export interface CalendarViewModel {
    setUpdateViewState(callback: (model: CalendarUiModel) => void): void;
    initialize(settings: PluginSettings): void;
    openDailyNote(key: ModifierKey, period: Period): Promise<void>;
    openWeeklyNote(key: ModifierKey, period: Period): Promise<void>;
    openMonthlyNote(key: ModifierKey, period: Period): Promise<void>;
    openQuarterlyNote(key: ModifierKey, period: Period): Promise<void>;
    openYearlyNote(key: ModifierKey, period: Period): Promise<void>;
    loadPreviousWeek(): void;
    loadNextWeek(): void;
}

export class DefaultCalendarViewModel implements CalendarViewModel {
    private settings: PluginSettings = DEFAULT_PLUGIN_SETTINGS;
    private model: CalendarUiModel = calendarUiModel(this.settings.generalSettings.firstDayOfWeek, []);
    private updateModel: (uiModel: CalendarUiModel) => void;

    constructor(
        private readonly calendarService: CalendarService
    ) {

    }

    public setUpdateViewState(callback: (model: CalendarUiModel) => void): void {
        this.updateModel = callback;
    }

    public initialize(settings: PluginSettings): void {
        this.calendarService.initialize(settings, (model) => {
            this.updateModel(model);
        });
    }

    public loadPreviousWeek(): void {
        this.calendarService.loadPreviousWeek(this.model, this.updateModel.bind(this));
    }

    public loadNextWeek(): void {
        this.calendarService.loadNextWeek(this.model, this.updateModel.bind(this));
    }

    public async openDailyNote(key: ModifierKey, period: Period): Promise<void> {
        await this.calendarService.openPeriodicNote(key, period, this.settings.dailyNotes).then(() => {
            // TODO: Send event to display notes created on this day
        });
    }

    public async openWeeklyNote(key: ModifierKey, period: Period): Promise<void> {
        await this.calendarService.openPeriodicNote(key, period, this.settings.weeklyNotes).then(() => {
            // TODO: Send event to display notes created in this week
        });
    }

    public async openMonthlyNote(key: ModifierKey, period: Period): Promise<void> {
        await this.calendarService.openPeriodicNote(key, period, this.settings.monthlyNotes).then(() => {
            // TODO: Send event to display notes created in this month
        });
    }

    public async openQuarterlyNote(key: ModifierKey, period: Period): Promise<void> {
        await this.calendarService.openPeriodicNote(key, period, this.settings.quarterlyNotes).then(() => {
            // TODO: Send event to display notes created in this quarter
        });
    }

    public async openYearlyNote(key: ModifierKey, period: Period): Promise<void> {
        await this.calendarService.openPeriodicNote(key, period, this.settings.yearlyNotes);
    }
}