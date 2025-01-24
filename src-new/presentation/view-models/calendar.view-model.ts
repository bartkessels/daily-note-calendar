import {CalendarModel, CalendarViewState, createEmptyCalendarModel} from 'src-new/presentation/models/calendar.model';
import {DateManager} from 'src-new/business/contracts/date.manager';
import {DayOfWeek} from 'src-new/domain/models/week.model';

export interface CalendarViewModel {
    setUpdateViewState(callback: (model: CalendarModel) => void): void;
    initialize(): void;
    loadPreviousWeek(): void;
    loadNextWeek(): void;
}

export class DefaultCalendarViewModel implements CalendarViewModel {
    private updateModel: (uiModel: CalendarModel) => void;
    private model: CalendarModel = createEmptyCalendarModel();

    constructor(
        private readonly dateManager: DateManager
    ) {

    }

    public setStartDayOfWeek(dayOfWeek: DayOfWeek): void {
        this.updateModel({ ...this.model, firstDayOfWeek: dayOfWeek });

        // TODO: Communicate this change to the date manager as well
    }

    public setUpdateViewState(callback: (model: CalendarModel) => void): void {
        this.updateModel = callback;
    }

    public initialize(): void {
        this.setLoadingState();

        const currentWeek = this.dateManager.getCurrentWeek();
        const previousWeeks = this.dateManager.getPreviousWeeks(currentWeek, 2);
        const nextWeeks = this.dateManager.getNextWeeks(currentWeek, 2);

        this.setLoadedState([...previousWeeks, ...nextWeeks].unique());
    }

    public loadPreviousWeek(): void {
        this.setLoadingState();

        const oldestWeek = this.model.weeks.shift();
        const previousWeek = this.dateManager.getPreviousWeeks(oldestWeek, 1);

        this.setLoadedState([...previousWeek, ...this.model.weeks]);
    }

    public loadNextWeek(): void {
        this.setLoadingState();

        const latestWeek = this.model.weeks.pop();
        const nextWeeks = this.dateManager.getPreviousWeeks(latestWeek, 1);

        this.setLoadedState([...nextWeeks, ...this.model.weeks]);
    }

    private setLoadingState(): void {
        this.updateModel({ ...this.model, viewState: CalendarViewState.Loading });
    }

    private setLoadedState(weeks: WeekModel[]): void {
        this.updateModel({ ...this.model, viewState: CalendarViewState.Loaded, weeks: weeks });
    }
}