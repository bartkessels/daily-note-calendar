import { Period } from 'src-new/domain/models/date.model';
import {CalendarModel} from 'src-new/presentation/models/calendar.model';

export interface CalendarViewModel {
    model: CalendarModel;

    initialize(): Promise<void>;
    loadPreviousWeek(): Promise<void>;
    loadNextWeek(): Promise<void>;
    selectPeriod(period: Period): void;
}