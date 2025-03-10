import {WeekUiModel} from 'src/presentation/models/week.ui-model';
import {PeriodUiModel} from 'src/presentation/models/period.ui-model';

export abstract class WeekViewState { }

export class LoadingWeekViewState extends WeekViewState { }

export class LoadedWeekViewState extends WeekViewState {
    constructor(
        public readonly week: WeekUiModel
    ) {
        super();
    }

    public getMonth(): PeriodUiModel {
        return this.week.month;
    }

    public getQuarter(): PeriodUiModel {
        // TODO: Get the actual quarter
        return this.week.month;
    }

    public getYear(): PeriodUiModel {
        return this.week.year;
    }
}