import {PeriodUiModel} from 'src/presentation/models/period.ui-model';

export abstract class PeriodViewState { }

export class EmptyPeriodViewState extends PeriodViewState { }

export class LoadingPeriodViewState extends PeriodViewState {
    constructor(
        public readonly previousModel?: PeriodUiModel | null
    ) {
        super();
    }
}

export class LoadedPeriodViewState extends PeriodViewState {
    constructor(
        public readonly model: PeriodUiModel
    ) {
        super();
    }
}