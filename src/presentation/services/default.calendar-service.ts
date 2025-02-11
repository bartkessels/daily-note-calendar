import { Period } from 'src/domain/models/period.model';
import {DEFAULT_PLUGIN_SETTINGS, PluginSettings} from 'src/domain/settings/plugin.settings';
import {CalendarService} from 'src/presentation/contracts/calendar-service';
import {calendarUiModel, CalendarUiModel} from '../models/calendar.ui-model';
import {DateManager} from 'src/business/contracts/date.manager';
import {PeriodicNoteManager} from 'src/business/contracts/periodic-note.manager';
import {WeekUiModel, weekUiModel} from 'src/presentation/models/week.ui-model';
import {isCreateFileModifierKey, ModifierKey} from 'src/presentation/models/modifier-key';
import {PeriodNoteSettings} from 'src/domain/settings/period-note.settings';
import {periodUiModel, PeriodUiModel} from 'src/presentation/models/period.ui-model';
import {CalendarEnhancer} from 'src/presentation/contracts/calendar.enhancer';
import {WeekModel} from 'src/domain/models/week.model';
import {DateManagerFactory} from 'src/business/contracts/date-manager-factory';

export class DefaultCalendarService implements CalendarService {
    private readonly dateManager: DateManager;
    private settings: PluginSettings = DEFAULT_PLUGIN_SETTINGS;

    constructor(
        private readonly dateManagerFactory: DateManagerFactory,
        private readonly periodicNoteManager: PeriodicNoteManager,
        private readonly enhancer: CalendarEnhancer
    ) {
        this.dateManager = this.dateManagerFactory.getManager();
    }

    public initialize(settings: PluginSettings, today: Period, callback: (model: CalendarUiModel) => void): void {
        this.settings = settings;
        this.enhancer.withSettings(this.settings);

        const firstDayOfWeek = this.settings.generalSettings.firstDayOfWeek;

        const uiModel = calendarUiModel(firstDayOfWeek, [], today, today);
        this.loadCurrentWeek(uiModel, callback);
    }

    public selectPeriod(model: CalendarUiModel | null, period: Period, callback: (model: CalendarUiModel) => void): void {
        const firstDayOfWeek = this.settings.generalSettings.firstDayOfWeek;
        const week = this.dateManager.getWeek(period, firstDayOfWeek);
        const weeks = this.expandWeek(week, 2, 2);

        this.buildModel(null, weeks, callback);
    }

    public loadCurrentWeek(model: CalendarUiModel | null, callback: (model: CalendarUiModel) => void): void {
        const firstDayOfWeek = this.settings.generalSettings.firstDayOfWeek;
        const currentWeek = this.dateManager.getCurrentWeek(firstDayOfWeek);
        const weeks = this.expandWeek(currentWeek, 2, 2);

        this.buildModel(model, weeks, callback);
    }

    public loadPreviousWeek(model: CalendarUiModel | null, callback: (model: CalendarUiModel) => void): void {
        const weeks = this.expandWeeks(model?.weeks, 3, 1);
        this.buildModel(model, weeks, callback);
    }

    public loadNextWeek(model: CalendarUiModel | null, callback: (model: CalendarUiModel) => void): void {
        const weeks = this.expandWeeks(model?.weeks, 1, 3);
        this.buildModel(model, weeks, callback);
    }

    public async openPeriodicNote(
        model: CalendarUiModel | null,
        key: ModifierKey,
        period: PeriodUiModel,
        settings: PeriodNoteSettings,
        callback: (model: CalendarUiModel) => void
    ): Promise<void> {
        if (!model) {
            return;
        }

        const requireModifierKeyForCreatingNote = this.settings.generalSettings.useModifierKeyToCreateNote;
        const isCreateFileModifierKeyPressed = isCreateFileModifierKey(key);
        const shouldCreateNote =
            !requireModifierKeyForCreatingNote ||
            (requireModifierKeyForCreatingNote && isCreateFileModifierKeyPressed);

        const updatedModel = { ...model, selectedPeriod: period };
        this.buildModel(updatedModel, updatedModel.weeks, callback);

        if (shouldCreateNote) {
            await this.periodicNoteManager.createNote(settings, period.period);
            this.buildModel(updatedModel, updatedModel.weeks, callback);
        }

        await this.periodicNoteManager.openNote(settings, period.period);
    }

    private getMonth(weeks: WeekUiModel[]): PeriodUiModel {
        const middleWeek = this.getMiddleWeek(weeks);
        return middleWeek.month;
    }

    private getYear(weeks: WeekUiModel[]): PeriodUiModel {
        const middleWeek = this.getMiddleWeek(weeks);
        return middleWeek.year;
    }

    private getQuarter(weeks: WeekUiModel[]): PeriodUiModel {
        const middleWeek = this.getMiddleWeek(weeks);
        const quarter = this.dateManager.getQuarter(middleWeek.month.period);
        return periodUiModel(quarter);
    }

    private getMiddleWeek(weeks: WeekUiModel[]): WeekUiModel {
        const middleWeekIndex = Math.floor(weeks.length / 2);
        return weeks[middleWeekIndex];
    }

    private buildModel(model: CalendarUiModel | null, weeks: WeekUiModel[], callback: (model: CalendarUiModel) => void): void {
        if (!model) {
            return;
        }

        const updatedModel = {
            ...model,
            lastUpdated: new Date(),
            year: this.getYear(weeks),
            quarter: this.getQuarter(weeks),
            month: this.getMonth(weeks),
            weeks: weeks
        };

        callback(updatedModel);
        this.enhance(updatedModel, callback);
    }

    private expandWeeks(weeksToExpand: WeekUiModel[] | undefined, noPreviousWeeks: number, noNextWeeks: number): WeekUiModel[] {
        if (!weeksToExpand) {
            return [];
        }

        const currentWeek = this.getMiddleWeek(weeksToExpand).period;
        return this.expandWeek(currentWeek, noPreviousWeeks, noNextWeeks);
    }

    private expandWeek(weekToExpand: WeekModel, noPreviousWeeks: number, noNextWeeks: number): WeekUiModel[] {
        const firstDayOfWeek = this.settings.generalSettings.firstDayOfWeek;

        const previousWeeks = this.dateManager.getPreviousWeeks(firstDayOfWeek, weekToExpand, noPreviousWeeks);
        const nextWeeks = this.dateManager.getNextWeeks(firstDayOfWeek, weekToExpand, noNextWeeks);
        const weeks = [...previousWeeks, weekToExpand, ...nextWeeks].sort((a, b) => a.weekNumber - b.weekNumber);

        return weeks.map(weekUiModel);
    }

    private enhance(model: CalendarUiModel, callback: (model: CalendarUiModel) => void): void {
        this.enhancer.enhance(model).then(callback.bind(this));
    }
}