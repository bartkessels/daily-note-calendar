import {arePeriodsEqual, Period} from 'src/domain/models/period.model';

export interface PeriodUiModel {
    period: Period;
    hasPeriodNote: boolean;
}

export function periodUiModel(period: Period): PeriodUiModel {
    return {
        period: period,
        hasPeriodNote: false,
    };
}

export function arePeriodUiModelsEqual(periodA?: PeriodUiModel, periodB?: PeriodUiModel): boolean {
    return arePeriodsEqual(periodA?.period, periodB?.period);
}
