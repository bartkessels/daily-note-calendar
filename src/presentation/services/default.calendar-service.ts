import {DEFAULT_PLUGIN_SETTINGS, PluginSettings} from 'src/domain/settings/plugin.settings';
import {CalendarService} from 'src/presentation/contracts/calendar-service';
import {DateManager} from 'src/business/contracts/date.manager';
import {PeriodicNoteManager} from 'src/business/contracts/periodic-note.manager';
import {isCreateFileModifierKey, isSelectModifierKey, ModifierKey} from 'src/presentation/models/modifier-key';
import {PeriodNoteSettings} from 'src/domain/settings/period-note.settings';
import {DateManagerFactory} from 'src/business/contracts/date-manager-factory';
import {WeekModel} from 'src/domain/models/week.model';
import {Period} from 'src/domain/models/period.model';

export class DefaultCalendarService implements CalendarService {
    private readonly dateManager: DateManager;
    private settings: PluginSettings = DEFAULT_PLUGIN_SETTINGS;

    constructor(
        private readonly dateManagerFactory: DateManagerFactory,
        private readonly periodicNoteManager: PeriodicNoteManager
    ) {
        this.dateManager = this.dateManagerFactory.getManager();
    }

    public initialize(settings: PluginSettings): void {
        this.settings = settings;
    }

    public async openPeriodicNote(key: ModifierKey, period: Period, settings: PeriodNoteSettings): Promise<void> {
        const requireModifierKeyForCreatingNote = this.settings.generalSettings.useModifierKeyToCreateNote;
        const isCreateFileModifierKeyPressed = isCreateFileModifierKey(key) && requireModifierKeyForCreatingNote;
        const shouldCreateNote = (!requireModifierKeyForCreatingNote || isCreateFileModifierKeyPressed);

        if (shouldCreateNote) {
            await this.periodicNoteManager.createNote(settings, period);
            await this.periodicNoteManager.openNote(settings, period);
        } else {
            await this.periodicNoteManager.openNote(settings, period);
        }
    }

    public async deletePeriodicNote(period: Period, settings: PeriodNoteSettings): Promise<void> {
        await this.periodicNoteManager.deleteNote(settings, period);
    }

    public getCurrentWeek(): WeekModel[] {
        const firstDayOfWeek = this.settings.generalSettings.firstDayOfWeek;
        const weekNumberStandard = this.settings.generalSettings.weekNumberStandard;
        const currentWeek = this.dateManager.getCurrentWeek(firstDayOfWeek, weekNumberStandard);

        return this.loadWeeks(currentWeek, 2, 2);
    }

    public getPreviousWeek(weeks: WeekModel[]): WeekModel[] {
        const middleWeek = this.getMiddleWeek(weeks);
        return this.loadWeeks(middleWeek, 3, 1);
    }

    public getNextWeek(weeks: WeekModel[]): WeekModel[] {
        const middleWeek = this.getMiddleWeek(weeks);
        return this.loadWeeks(middleWeek, 1, 3);
    }

    public getPreviousMonth(weeks: WeekModel[]): WeekModel[] {
        const middleWeek = this.getMiddleWeek(weeks);
        const firstDayOfWeek = this.settings.generalSettings.firstDayOfWeek;
        const weekNumberStandard = this.settings.generalSettings.weekNumberStandard;
        const previousMonth = this.dateManager.getPreviousMonth(middleWeek, firstDayOfWeek, weekNumberStandard);

        return this.sortWeeks(previousMonth);
    }

    public getNextMonth(weeks: WeekModel[]): WeekModel[] {
        const middleWeek = this.getMiddleWeek(weeks);
        const firstDayOfWeek = this.settings.generalSettings.firstDayOfWeek;
        const weekNumberStandard = this.settings.generalSettings.weekNumberStandard;
        const nextMonth = this.dateManager.getNextMonth(middleWeek, firstDayOfWeek, weekNumberStandard);

        return this.sortWeeks(nextMonth);
    }

    private getMiddleWeek(weeks: WeekModel[]): WeekModel {
        return weeks[Math.floor(weeks.length / 2)];
    }

    private loadWeeks(currentWeek: WeekModel, noPreviousWeeks: number, noNextWeeks: number): WeekModel[] {
        const firstDayOfWeek = this.settings.generalSettings.firstDayOfWeek;
        const weekNumberStandard = this.settings.generalSettings.weekNumberStandard;

        const previousWeeks = this.dateManager.getPreviousWeeks(currentWeek, firstDayOfWeek, weekNumberStandard, noPreviousWeeks);
        const nextWeeks = this.dateManager.getNextWeeks(currentWeek, firstDayOfWeek, weekNumberStandard, noNextWeeks);
        const weeks = [...previousWeeks, currentWeek, ...nextWeeks];

        return this.sortWeeks(weeks);
    }

    private sortWeeks(weeks: WeekModel[]): WeekModel[] {
        return weeks.sort((a, b) => a.date.getTime() - b.date.getTime());
    }
}