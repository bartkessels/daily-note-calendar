import {LoadedWeekViewState, LoadingWeekViewState, WeekViewState} from 'src/presentation/view-states/week.view-state';
import {PeriodUiModel} from 'src/presentation/models/period.ui-model';

export interface CalendarViewState {
    week1: WeekViewState;
    week2: WeekViewState;
    week3: WeekViewState;
    week4: WeekViewState;
    week5: WeekViewState;

    getWeeks(): WeekViewState[];
    getMonth(): PeriodUiModel | null;
    getQuarter(): PeriodUiModel | null;
    getYear(): PeriodUiModel | null;
}

export class LoadingCalendarViewState implements CalendarViewState {
    public readonly week1 = new LoadingWeekViewState();
    public readonly week2 = new LoadingWeekViewState();
    public readonly week3 = new LoadingWeekViewState();
    public readonly week4 = new LoadingWeekViewState();
    public readonly week5 = new LoadingWeekViewState();

    public getWeeks(): WeekViewState[] {
        return [this.week1, this.week2, this.week3, this.week4, this.week5];
    }

    public getMonth(): PeriodUiModel | null {
        return null;
    }

    public getQuarter(): PeriodUiModel | null {
        return null;
    }

    public getYear(): PeriodUiModel | null {
        return null;
    }
}

export class LoadedCalendarViewState implements CalendarViewState {
    constructor(
        public readonly week1: WeekViewState,
        public readonly week2: WeekViewState,
        public readonly week3: WeekViewState,
        public readonly week4: WeekViewState,
        public readonly week5: WeekViewState
    ) {

    }

    public getWeeks(): WeekViewState[] {
        return [this.week1, this.week2, this.week3, this.week4, this.week5];
    }

    public getMonth(): PeriodUiModel | null {
        if (this.week3 instanceof LoadedWeekViewState) {
            return this.week3.getMonth();
        }

        return null;
    }

    public getQuarter(): PeriodUiModel | null {
        if (this.week3 instanceof LoadedWeekViewState) {
            return this.week3.getQuarter();
        }

        return null;
    }

    public getYear(): PeriodUiModel | null {
        if (this.week3 instanceof LoadedWeekViewState) {
            return this.week3.getYear();
        }

        return null;
    }
}