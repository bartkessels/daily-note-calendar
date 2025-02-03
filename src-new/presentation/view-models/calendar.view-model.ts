import {
    calendarUiModel,
    CalendarUiModel,
    createEmptyCalendarModel
} from 'src-new/presentation/models/calendar.ui-model';
import {DateManager} from 'src-new/business/contracts/date.manager';
import {WeekModel} from 'src-new/domain/models/week.model';
import {DEFAULT_PLUGIN_SETTINGS, PluginSettings} from 'src-new/domain/settings/plugin.settings';
import {Period} from 'src-new/domain/models/period.model';
import {isCreateFileModifierKey, ModifierKey} from 'src/domain/models/modifier-key';
import {PeriodNoteSettings} from 'src-new/domain/settings/period-note.settings';
import {PeriodicNoteManager} from 'src-new/business/contracts/periodic-note.manager';
import {WeekUiModel} from 'src-new/presentation/models/week.ui-model';

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
    private model: CalendarUiModel = createEmptyCalendarModel(this.settings.generalSettings.firstDayOfWeek);
    private updateModel: (uiModel: CalendarUiModel) => void;

    constructor(
        private readonly dateManager: DateManager,
        private readonly periodManager: PeriodicNoteManager
    ) {

    }

    public setUpdateViewState(callback: (model: CalendarUiModel) => void): void {
        this.updateModel = callback;
    }

    public initialize(settings: PluginSettings): void {
        this.settings = settings;
        const firstDayOfWeek = this.settings.generalSettings.firstDayOfWeek;

        const currentDay = this.dateManager.getCurrentDay();
        const currentWeek = this.dateManager.getCurrentWeek(firstDayOfWeek);
        const previousWeeks = this.dateManager.getPreviousWeeks(firstDayOfWeek, currentWeek, 2);
        const nextWeeks = this.dateManager.getNextWeeks(firstDayOfWeek, currentWeek, 2);

        const weeks = [...previousWeeks, currentWeek, ...nextWeeks].unique();
        const uiModel = calendarUiModel(firstDayOfWeek, weeks, currentDay);
        this.updateModel({
            ...this.model,
            ...uiModel
        });
    }

    public loadPreviousWeek(): void {
        const oldestWeek = this.model.weeks.shift();
        const firstDayOfWeek = this.settings.generalSettings.firstDayOfWeek;

        if (oldestWeek) {
            const previousWeek = this.dateManager.getPreviousWeeks(firstDayOfWeek, oldestWeek.period, 1);
            this.updateWeeks([...previousWeek, ...this.model.weeks]);
        }
    }

    public loadNextWeek(): void {
        const latestWeek = this.model.weeks.pop();
        const firstDayOfWeek = this.settings.generalSettings.firstDayOfWeek;

        if (latestWeek) {
            const nextWeeks = this.dateManager.getPreviousWeeks(firstDayOfWeek, latestWeek.period, 1);
            this.updateWeeks([...this.model.weeks, ...nextWeeks]);
        }
    }

    public async openDailyNote(key: ModifierKey, period: Period): Promise<void> {
        await this.openPeriodicNote(key, period, this.settings.dailyNotes).then(() => {
            // TODO: Send event to display notes created on this day
        });
    }

    public async openWeeklyNote(key: ModifierKey, period: Period): Promise<void> {
        await this.openPeriodicNote(key, period, this.settings.weeklyNotes).then(() => {
            // TODO: Send event to display notes created in this week
        });
    }

    public async openMonthlyNote(key: ModifierKey, period: Period): Promise<void> {
        await this.openPeriodicNote(key, period, this.settings.monthlyNotes).then(() => {
            // TODO: Send event to display notes created in this month
        });
    }

    public async openQuarterlyNote(key: ModifierKey, period: Period): Promise<void> {
        await this.openPeriodicNote(key, period, this.settings.quarterlyNotes).then(() => {
            // TODO: Send event to display notes created in this quarter
        });
    }

    public async openYearlyNote(key: ModifierKey, period: Period): Promise<void> {
        await this.openPeriodicNote(key, period, this.settings.yearlyNotes);
    }

    private async openPeriodicNote(key: ModifierKey, period: Period, settings: PeriodNoteSettings): Promise<void> {
        const requireModifierKeyForCreatingNote = this.settings.generalSettings.useModifierKeyToCreateNote;

        if (!requireModifierKeyForCreatingNote || (requireModifierKeyForCreatingNote && isCreateFileModifierKey(key))) {
            await this.periodManager.createNote(settings, period);
        }

        await this.periodManager.openNote(settings, period);
        this.updateModel({ ...this.model, selectedPeriod: period });
    }

    private updateWeeks(weeks: WeekUiModel[]): void {
        this.updateModel({ ...this.model, weeks: weeks });
    }
}