import {Day} from 'src/domain/models/day';
import {Month} from 'src/domain/models/month';
import {Year} from 'src/domain/models/year';
import {CalendarUiModel, createCalendarUiModel} from 'src/components/models/calendar.ui-model';
import {Event} from 'src/domain/events/event';
import {DateManager} from 'src/domain/managers/date.manager';
import {Enhancer} from 'src/domain/enhancers/enhancer';
import {CalendarViewState} from 'src/components/viewmodels/calendar.view-state';

export interface CalendarViewModel {
    viewState: CalendarViewState;

    navigateToPreviousMonth: () => Promise<void>;
    navigateToNextMonth: () => Promise<void>;
    navigateToCurrentMonth: () => Promise<void>;
}

export class DefaultCalendarViewModel implements CalendarViewModel {
    public viewState: CalendarViewState;
    private selectedDay?: Day;
    private selectedMonth?: Month;
    private selectedYear?: Year;

    constructor(
        private readonly setUiModel: (uiModel?: CalendarUiModel) => void,
        private readonly selectDayEvent: Event<Day> | null,
        private readonly dailyNoteEvent: Event<Day> | null,
        private readonly dateManager: DateManager | null,
        private readonly calendarEnhancer: Enhancer<CalendarUiModel> | null
    ) {
        this.selectDayEvent?.onEvent('CalendarViewModel', (day: Day) => this.selectDay(day).then());
        this.dailyNoteEvent?.onEvent('CalendarViewModel', (day: Day) => this.selectDay(day).then());
    }

    public async initialize(): Promise<void> {
        this.selectedDay = this.dateManager?.getCurrentDay();
        this.selectedMonth = this.dateManager?.getCurrentMonth();
        this.selectedYear = this.dateManager?.getCurrentYear();

        await this.updateViewState();
    }

    public withViewState(viewState?: CalendarViewState): CalendarViewModel {
        return {
            ...this,
            viewState: viewState
        };
    }

    public navigateToPreviousMonth = async (): Promise<void> => {
        const previousMonth = this.dateManager?.getPreviousMonth(this.selectedMonth);
        await this.selectMonth(previousMonth);
    }

    public navigateToNextMonth = async (): Promise<void> => {
        const nextMonth = this.dateManager?.getNextMonth(this.selectedMonth);
        await this.selectMonth(nextMonth);
    }

    public navigateToCurrentMonth = async (): Promise<void> => {
        const currentMonth = this.dateManager?.getCurrentMonth();
        await this.selectMonth(currentMonth);
    }

    private selectDay = async (day?: Day): Promise<void> => {
        this.selectedDay = day;
        await this.updateViewState();
    }

    private selectMonth = async (month?: Month): Promise<void> => {
        this.selectedMonth = month;
        this.selectedYear = this.dateManager?.getYear(month);

        await this.updateViewState();
    }

    private updateViewState = async (): Promise<void> => {
        if (!this.selectedYear || !this.selectedMonth) {
            return;
        }

        const uiModel = createCalendarUiModel(this.selectedYear, this.selectedMonth, this.selectedDay);
        const enhancedModel = await this.calendarEnhancer?.withValue(uiModel).build();
        this.setUiModel(enhancedModel);
    };
}
