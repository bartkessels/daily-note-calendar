import {WeekUiModel} from 'src/presentation/models/week.ui-model';
import {WeekModel} from 'src/domain/models/week.model';
import {PluginSettings} from 'src/domain/settings/plugin.settings';
import {UiModelBuilder} from 'src/presentation/contracts/ui-model-builder';
import {PeriodUiModel} from 'src/presentation/models/period.ui-model';
import {Period} from 'src/domain/models/period.model';
import {PeriodEnhancer} from 'src/presentation/contracts/period.enhancer';

export class WeekUiModelBuilder implements UiModelBuilder<WeekModel[], WeekUiModel[]> {
    private model: WeekModel[] = [];

    constructor(
        private readonly periodEnhancer: PeriodEnhancer,
        private readonly periodUiModelBuilder: UiModelBuilder<Period, PeriodUiModel>
    ) {

    }

    public withSettings(settings: PluginSettings): void {
        this.periodEnhancer.withSettings(settings);
        this.periodUiModelBuilder.withSettings(settings);
    }

    public withValue(value: WeekModel[]): UiModelBuilder<WeekModel[], WeekUiModel[]> {
        this.model = value;
        return this;
    }

    public async build(): Promise<WeekUiModel[]> {
        return await Promise.all(this.model.map(async (w) => await this.buildUiModel(w)));
    }

    private async buildUiModel(week: WeekModel): Promise<WeekUiModel> {
        const year = await this.periodUiModelBuilder.withValue(week.year).build();
        const quarter = await this.periodUiModelBuilder.withValue(week.quarter).build();
        const month = await this.periodUiModelBuilder.withValue(week.month).build();
        const days = await this.buildDays(week.days);

        const uiModel = <WeekUiModel>{
            period: week,
            hasPeriodNote: false,
            weekNumber: week.weekNumber,
            year: year,
            quarter: quarter,
            month: month,
            days: days,
        };

        return await this.periodEnhancer.enhance<WeekUiModel>(uiModel);
    }

    private async buildDays(days: Period[]): Promise<PeriodUiModel[]> {
        const uiModels: PeriodUiModel[] = [];

        for (const day of days) {
            const uiModel = await this.periodUiModelBuilder.withValue(day).build();
            uiModels.push(uiModel);
        }

        return uiModels;
    }
}