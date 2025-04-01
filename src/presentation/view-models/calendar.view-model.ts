import {CalendarUiModel} from 'src/presentation/models/calendar.ui-model';
import {DEFAULT_PLUGIN_SETTINGS, PluginSettings} from 'src/domain/settings/plugin.settings';
import {Period} from 'src/domain/models/period.model';
import {CalendarService} from 'src/presentation/contracts/calendar-service';
import {DayOfWeek, WeekModel} from 'src/domain/models/week.model';

export interface CalendarViewModel {
    setUpdateUiModel(callback: (model: CalendarUiModel) => void): void;
    initialize(settings: PluginSettings, today: Period): void;
    loadCurrentWeek(): void;
    loadPreviousWeek(): void;
    loadNextWeek(): void;
    loadPreviousMonth(): void;
    loadNextMonth(): void;
}

export class DefaultCalendarViewModel implements CalendarViewModel {
    private settings: PluginSettings = DEFAULT_PLUGIN_SETTINGS;
    private today: Period | null = null;
    private uiModel: CalendarUiModel | null = null;
    private updateUiModel: (model: CalendarUiModel) => void;

    constructor(
        private readonly calendarService: CalendarService
    ) {

    }

    public setUpdateUiModel(callback: (model: CalendarUiModel) => void): void {
        this.updateUiModel = callback;
    }

    private setModel(model: CalendarUiModel): void {
        // Only update the UI model if it's the latest version of the UI model
        if (!this.uiModel || model.lastUpdateRequest > this.uiModel.lastUpdateRequest) {
            this.uiModel = model;

            if(this.updateUiModel) {
                this.updateUiModel(model);
            }
        }
    }

    public async initialize(settings: PluginSettings, today: Period): Promise<void> {
        this.settings = settings;
        this.today = today;

        this.calendarService.initialize(settings);
    }

    public async loadCurrentWeek(): Promise<void> {
        await this.updateWeeks((_: WeekModel[]): WeekModel[] => {
            return this.calendarService.getCurrentWeek();
        });
    }

    public async loadPreviousWeek(): Promise<void> {
        await this.updateWeeks(async (currentWeeks: WeekModel[]): Promise<WeekModel[]> => {
            return this.calendarService.getPreviousWeek(currentWeeks);
        });
    }

    public async loadNextWeek(): Promise<void> {
        await this.updateWeeks(async (currentWeeks: WeekModel[]): Promise<WeekModel[]> => {
            return this.calendarService.getNextWeek(currentWeeks);
        });
    }

    public async loadPreviousMonth(): Promise<void> {
        const weeks = this.uiModel?.weeks;
        if (!weeks) {
            return;
        }

        await this.updateMonth(async (): Promise<WeekModel[]> => {
            return this.calendarService.getPreviousMonth(weeks);
        });
    }

    public async loadNextMonth(): Promise<void> {
        const weeks = this.uiModel?.weeks;
        if (!weeks) {
            return;
        }

        await this.updateMonth(async (): Promise<WeekModel[]> => {
            return this.calendarService.getNextMonth(weeks);
        });
    }

    private async updateMonth(action: (currentWeeks: WeekModel[]) => Promise<WeekModel[]>): Promise<void> {
        await this.updateWeeks(async (currentWeeks): Promise<WeekModel[]> => {
            return await action(currentWeeks);
        });
    }

    private updateWeeks(action: (currentWeeks: WeekModel[]) => WeekModel[]): void {
        const currentWeeks = this.uiModel?.weeks;
        if (!currentWeeks) {
            return;
        }

        const startWeekOnMonday = this.settings.generalSettings.firstDayOfWeek === DayOfWeek.Monday;
        const weeks = action(currentWeeks);

        const uiModel = <CalendarUiModel> {
            lastUpdateRequest: new Date(),
            startWeekOnMonday: startWeekOnMonday,
            today: this.today,
            weeks: weeks,
            month: this.calendarService.getMonthForWeeks(weeks),
            quarter: this.calendarService.getQuarterForWeeks(weeks),
            year: this.calendarService.getYearForWeeks(weeks)
        };

        this.updateUiModel(uiModel);
    }
}