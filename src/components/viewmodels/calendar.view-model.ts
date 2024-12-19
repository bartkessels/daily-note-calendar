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

    navigateToPreviousMonth: () => void;
    navigateToNextMonth: () => void;
    navigateToCurrentMonth: () => void;
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
        this.selectDayEvent?.onEvent('CalendarViewModel', (day: Day): void => this.selectDay(day));
        this.dailyNoteEvent?.onEvent('CalendarViewModel', (day: Day): void => this.selectDay(day));

        this.selectedDay = dateManager?.getCurrentDay();
        this.selectedMonth = dateManager?.getCurrentMonth();
        this.selectedYear = dateManager?.getCurrentYear();
    }

    public withViewState(viewState?: CalendarViewState): CalendarViewModel {
        return {
            ...this,
            viewState: viewState
        };
    }

    public navigateToPreviousMonth = (): void => {
        const previousMonth = this.dateManager?.getPreviousMonth(this.selectedMonth);
        this.selectMonth(previousMonth);
    }

    public navigateToNextMonth = (): void => {
        const nextMonth = this.dateManager?.getNextMonth(this.selectedMonth);
        console.log(nextMonth);
        console.log(this.selectedMonth);
        this.selectMonth(nextMonth);
    }

    public navigateToCurrentMonth = (): void => {
        const currentMonth = this.dateManager?.getCurrentMonth();
        this.selectMonth(currentMonth);
    }

    private selectDay = (day?: Day): void => {
        this.selectedDay = day;
        this.updateViewState().then();
    }

    private selectMonth = (month?: Month): void => {
        this.selectedMonth = month;
        this.selectedYear = this.dateManager?.getYear(month);

        this.updateViewState().then();
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
