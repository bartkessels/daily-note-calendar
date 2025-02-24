import {arePeriodsEqual, Period} from 'src/domain/models/period.model';

export interface PeriodUiModel {
    period: Period;
    hasPeriodNote: boolean;
    noNotes: number;
    isLoading: boolean;
}

export function periodUiModel(period: Period): PeriodUiModel {
    return {
        period: period,
        hasPeriodNote: false,
        noNotes: 0,
        isLoading: false
    };
}

export function arePeriodUiModelsEqual(periodA?: PeriodUiModel, periodB?: PeriodUiModel): boolean {
    return arePeriodsEqual(periodA?.period, periodB?.period);
}
