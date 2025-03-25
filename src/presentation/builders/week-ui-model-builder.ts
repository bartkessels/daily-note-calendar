import {WeekUiModel} from 'src/presentation/models/week.ui-model';
import {WeekModel} from 'src/domain/models/week.model';
import {PeriodNoteExistsPeriodEnhancer} from 'src/presentation/enhancers/period-note-exists.period-enhancer';
import {PluginSettings} from 'src/domain/settings/plugin.settings';
import {UiModelBuilder} from 'src/presentation/contracts/ui-model-builder';
import {PeriodUiModelBuilder} from 'src/presentation/builders/period.ui-model-builder';
import {periodUiModel, PeriodUiModel} from 'src/presentation/models/period.ui-model';

export class WeekUiModelBuilder implements UiModelBuilder<WeekModel[], WeekUiModel[]> {
    private model: WeekModel[] = [];

    constructor(
        private readonly weeklyNoteExistsPeriodEnhancer: PeriodNoteExistsPeriodEnhancer,
        private readonly periodUiModelBuilder: PeriodUiModelBuilder
    ) {

    }

    public withSettings(settings: PluginSettings): void {
        this.weeklyNoteExistsPeriodEnhancer.withSettings(settings);
    }

    public withValue(value: WeekModel[]): UiModelBuilder<WeekModel[], WeekUiModel[]> {
        this.model = value;
        return this;
    }

    public async build(): Promise<WeekUiModel[]> {
        return await Promise.all(this.model.map(async (w) => await this.buildUiModel(w)));
    }

    private async buildUiModel(week: WeekModel): Promise<WeekUiModel> {
        const uiModel = <WeekUiModel>{
            period: week,
            hasPeriodNote: false,
            weekNumber: week.weekNumber,
            year: periodUiModel(week.year),
            quarter: periodUiModel(week.quarter),
            month: periodUiModel(week.month),
            days: week.days.map(periodUiModel),
        };

        const enhancedWeek = await this.weeklyNoteExistsPeriodEnhancer.enhance<WeekUiModel>(uiModel);
        const days = await this.buildDays(enhancedWeek.days);

        return <WeekUiModel> {...uiModel, days: days };
    }

    private async buildDays(days: PeriodUiModel[]): Promise<PeriodUiModel[]> {
        const uiModels: PeriodUiModel[] = [];

        for (const day of days) {
            const uiModel = await this.periodUiModelBuilder.withValue(day.period).build();
            uiModels.push(uiModel);
        }

        return uiModels;
    }
}