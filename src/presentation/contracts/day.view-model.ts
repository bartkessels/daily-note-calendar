import {PeriodNoteViewModel} from 'src/presentation/contracts/period.view-model';
import {Period} from 'src/domain/models/period.model';

export interface DayNoteViewModel extends PeriodNoteViewModel {
    getNoteCount(period: Period): Promise<number>;
}
