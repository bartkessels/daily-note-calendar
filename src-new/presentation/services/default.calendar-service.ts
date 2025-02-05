import { Period } from 'src-new/domain/models/period.model';
import {DEFAULT_PLUGIN_SETTINGS, PluginSettings} from 'src-new/domain/settings/plugin.settings';
import {CalendarService} from 'src-new/presentation/contracts/calendar-service';
import {calendarUiModel, CalendarUiModel} from '../models/calendar.ui-model';
import {DateManager} from 'src-new/business/contracts/date.manager';
import {PeriodicNoteManager} from 'src-new/business/contracts/periodic-note.manager';
import {WeekUiModel, weekUiModel} from 'src-new/presentation/models/week.ui-model';
import {isCreateFileModifierKey, ModifierKey} from 'src-new/presentation/models/modifier-key';
import {PeriodNoteSettings} from 'src-new/domain/settings/period-note.settings';
import {periodUiModel, PeriodUiModel} from 'src-new/presentation/models/period.ui-model';
import {CalendarEnhancer} from 'src-new/presentation/contracts/calendar.enhancer';

export class DefaultCalendarService implements CalendarService {
    private settings: PluginSettings = DEFAULT_PLUGIN_SETTINGS;

    constructor(
        private readonly dateManager: DateManager,
        private readonly periodicNoteManager: PeriodicNoteManager,
        private readonly enhancer: CalendarEnhancer
    ) {

    }

    public initialize(settings: PluginSettings, callback: (model: CalendarUiModel) => void): void {
        this.settings = settings;

        const firstDayOfWeek = this.settings.generalSettings.firstDayOfWeek;

        const currentDay = this.dateManager.getCurrentDay();
        const currentWeek = this.dateManager.getCurrentWeek(firstDayOfWeek);
        const previousWeeks = this.dateManager.getPreviousWeeks(firstDayOfWeek, currentWeek, 2);
        const nextWeeks = this.dateManager.getNextWeeks(firstDayOfWeek, currentWeek, 2);

        const weeks = [...previousWeeks, currentWeek, ...nextWeeks].unique();
        const uiModel = calendarUiModel(firstDayOfWeek, weeks, currentDay);
        const weeksUiModel = weeks.map(weekUiModel);

        callback(this.getModel(uiModel, weeksUiModel));
        this.enhance(uiModel, callback);
    }

    public loadPreviousWeek(model: CalendarUiModel, callback: (model: CalendarUiModel) => void): void {
        const oldestWeek = model.weeks.shift();
        const firstDayOfWeek = this.settings.generalSettings.firstDayOfWeek;

        if (oldestWeek) {
            const previousWeeks = this.dateManager.getPreviousWeeks(firstDayOfWeek, oldestWeek.period, 1);
            const previousWeeksUiModel = previousWeeks.map(weekUiModel);
            const weeks = [...previousWeeksUiModel, ...model.weeks].unique();

            callback(this.getModel(model, weeks));
            this.enhance(model, callback);
        }
    }

    public loadNextWeek(model: CalendarUiModel, callback: (model: CalendarUiModel) => void): void {
        const latestWeek = model.weeks.pop();
        const firstDayOfWeek = this.settings.generalSettings.firstDayOfWeek;

        if (latestWeek) {
            const nextWeeks = this.dateManager.getPreviousWeeks(firstDayOfWeek, latestWeek.period, 1);
            const nextWeeksUiModel = nextWeeks.map(weekUiModel);
            const weeks = [...nextWeeksUiModel, ...model.weeks].unique();

            callback(this.getModel(model, weeks));
            this.enhance(model, callback);
        }
    }

    public async openPeriodicNote(key: ModifierKey, period: Period, settings: PeriodNoteSettings): Promise<void> {
        const requireModifierKeyForCreatingNote = this.settings.generalSettings.useModifierKeyToCreateNote;
        const isCreateFileModifierKeyPressed = isCreateFileModifierKey(key);
        const shouldCreateNote =
            !requireModifierKeyForCreatingNote ||
            (requireModifierKeyForCreatingNote && isCreateFileModifierKeyPressed);

        if (shouldCreateNote) {
            await this.periodicNoteManager.createNote(settings, period);
        }

        await this.periodicNoteManager.openNote(settings, period);
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
        const middleWeekIndex = Math.ceil(weeks.length / 2);
        return weeks[middleWeekIndex];
    }

    private getModel(model: CalendarUiModel, weeks: WeekUiModel[]): CalendarUiModel {
        return {
            ...model,
            year: this.getYear(weeks),
            quarter: this.getQuarter(weeks),
            month: this.getMonth(weeks),
            weeks: weeks
        };
    }

    private enhance(model: CalendarUiModel, callback: (model: CalendarUiModel) => void): void {
        this.enhancer.enhance(model).then(callback);
    }
}