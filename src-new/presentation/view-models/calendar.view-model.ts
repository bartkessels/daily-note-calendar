import {CalendarModel} from 'src-new/presentation/models/calendar.model';

export interface CalendarViewModel {
    model: CalendarModel;

    initialize(): Promise<void>;
    loadPreviousWeek(): Promise<void>;
    loadNextWeek(): Promise<void>;
}