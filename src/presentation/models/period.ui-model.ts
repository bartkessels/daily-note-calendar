import {arePeriodsEqual, Period} from 'src/domain/models/period.model';
import {NoteUiModel} from 'src/presentation/models/note.ui-model';

export interface PeriodUiModel {
    period: Period;
    hasPeriodNote: boolean;
    notes: NoteUiModel[];
}

export function periodUiModel(period: Period): PeriodUiModel {
    return {
        period: period,
        hasPeriodNote: false,
        notes: []
    };
}

export function arePeriodUiModelsEqual(periodA?: PeriodUiModel, periodB?: PeriodUiModel): boolean {
    return arePeriodsEqual(periodA?.period, periodB?.period);
}
