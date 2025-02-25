import {CalendarUiModel} from 'src/presentation/models/calendar.ui-model';

export abstract class CalendarViewState {
    // uiModel: CalendarUiModel | null;
}

export class EmptyCalendarViewState implements CalendarViewState {

}

export class LoadingCalendarViewState implements CalendarViewState {
    // uiModel: CalendarUiModel | null = null;
}

export class LoadedCalendarViewState implements CalendarViewState {
    constructor(public uiModel: CalendarUiModel) { }
}