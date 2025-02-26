import {CalendarUiModel} from 'src/presentation/models/calendar.ui-model';

export abstract class CalendarViewState { }

export class EmptyCalendarViewState extends CalendarViewState { }

export class LoadingCalendarViewState extends CalendarViewState { }

export class LoadedCalendarViewState extends CalendarViewState {
    constructor(public uiModel: CalendarUiModel) {
        super();
    }
}