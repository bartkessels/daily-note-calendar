import {PeriodUiModel} from 'src/presentation/models/period.ui-model';

export abstract class PeriodViewState { }

export class EmptyPeriodViewState extends PeriodViewState { }

export class LoadingPeriodViewState extends PeriodViewState {
    constructor(public uiModel: PeriodUiModel) {
        super();
    }
}

export class LoadedPeriodViewState extends PeriodViewState {
    constructor(public uiModel: PeriodUiModel) {
        super();
    }
}