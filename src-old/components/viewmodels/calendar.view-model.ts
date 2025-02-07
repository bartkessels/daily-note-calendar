import {Day} from 'src-old/domain/models/day';
import {Month} from 'src-old/domain/models/month';
import {Year} from 'src-old/domain/models/year';
import {CalendarUiModel, createCalendarUiModel} from 'src-old/components/models/calendar.ui-model';
import {DateManager} from 'src-old/domain/managers/date.manager';
import {Enhancer} from 'src-old/domain/enhancers/enhancer';
import {CalendarViewState} from 'src-old/components/viewmodels/calendar.view-state';
import {ManageEvent} from 'src-old/domain/events/manage.event';

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
        private readonly manageDayEvent: ManageEvent<Day> | null,
        private readonly dateManager: DateManager | null,
        private readonly calendarEnhancer: Enhancer<CalendarUiModel> | null
    ) {
        this.manageDayEvent?.onEvent('CalendarViewModel', (day: Day, _) => this.selectDay(day));
    }

    public async initialize(): Promise<void> {
        this.selectedDay = this.dateManager?.getCurrentDay();
        this.selectedMonth = await this.dateManager?.getCurrentMonth();
        this.selectedYear = await this.dateManager?.getCurrentYear();

        await this.updateViewState();
    }

    public withViewState(viewState?: CalendarViewState): CalendarViewModel {
        return {
            ...this,
            viewState: viewState
        };
    }

    public navigateToPreviousMonth = async (): Promise<void> => {
        const previousMonth =  await this.dateManager?.getPreviousMonth(this.selectedMonth);
        await this.selectMonth(previousMonth);
    }

    public navigateToNextMonth = async (): Promise<void> => {
        const nextMonth = await this.dateManager?.getNextMonth(this.selectedMonth);
        await this.selectMonth(nextMonth);
    }

    public navigateToCurrentMonth = async (): Promise<void> => {
        const currentMonth = await this.dateManager?.getCurrentMonth();
        await this.selectMonth(currentMonth);
    }

    private selectDay = async (day?: Day): Promise<void> => {
        this.selectedDay = day;
        const month = await this.dateManager?.getMonth(day);
        await this.selectMonth(month);
    }

    private selectMonth = async (month?: Month): Promise<void> => {
        this.selectedMonth = month;
        this.selectedYear = await this.dateManager?.getYear(month);

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
