import {weekUiModel, WeekUiModel} from 'src/presentation/models/week.ui-model';
import {WeekModel} from 'src/domain/models/week.model';
import {PeriodNoteExistsPeriodEnhancer} from 'src/presentation/enhancers/period-note-exists.period-enhancer';
import {PluginSettings} from 'src/domain/settings/plugin.settings';
import {UiModelBuilder} from 'src/presentation/contracts/ui-model-builder';
import {PeriodUiModelBuilder} from 'src/presentation/builders/period.ui-model-builder';
import {PeriodUiModel} from 'src/presentation/models/period.ui-model';

export class WeekUiModelBuilder implements UiModelBuilder<WeekModel, WeekUiModel> {
    private model: WeekModel | null = null;

    constructor(
        private readonly weeklyNoteExistsPeriodEnhancer: PeriodNoteExistsPeriodEnhancer,
        private readonly periodUiModelBuilder: PeriodUiModelBuilder
    ) {

    }

    public withSettings(settings: PluginSettings): void {
        this.weeklyNoteExistsPeriodEnhancer.withSettings(settings);
    }

    public withValue(value: WeekModel): UiModelBuilder<WeekModel, WeekUiModel> {
        this.model = value;
        return this;
    }

    public async build(): Promise<WeekUiModel> {
        if (!this.model) {
            throw new Error('Model not set');
        }

        const defaultWeekUiModel = weekUiModel(this.model);
        let enhancedWeek = await this.weeklyNoteExistsPeriodEnhancer.enhance<WeekUiModel>(defaultWeekUiModel);
        const days = await this.buildDays(enhancedWeek.days);

        return <WeekUiModel> {...enhancedWeek, days: days};
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