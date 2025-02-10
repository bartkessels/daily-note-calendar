import {Period} from 'src/domain/models/period.model';

export interface PeriodUiModel {
    period: Period;
    hasPeriodNote: boolean;
    noNotes: number;
}

export function periodUiModel(period: Period): PeriodUiModel {
    return {
        period: period,
        hasPeriodNote: false,
        noNotes: 0
    };
}

export function arePeriodsEqual(periodA?: PeriodUiModel, periodB?: PeriodUiModel): boolean {
    if (!periodA || !periodB) {
        return false;
    }

    const areSameDate = periodA?.period.date.toDateString() === periodB?.period.date.toDateString();
    const areSameType = periodA?.period.type === periodB?.period.type;

    return areSameDate && areSameType;
}