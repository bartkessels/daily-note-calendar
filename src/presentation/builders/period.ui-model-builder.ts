import {UiModelBuilder} from 'src/presentation/contracts/ui-model-builder';
import {Period} from 'src/domain/models/period.model';
import {PeriodUiModel} from 'src/presentation/models/period.ui-model';
import {PluginSettings} from 'src/domain/settings/plugin.settings';
import {PeriodEnhancer} from 'src/presentation/contracts/period.enhancer';

export class PeriodUiModelBuilder implements UiModelBuilder<Period, PeriodUiModel> {
    private value: Period | null = null;

    constructor(
        private readonly periodEnhancer: PeriodEnhancer
    ) {

    }

    public withSettings(settings: PluginSettings): void {
        this.periodEnhancer.withSettings(settings);
    }

    public withValue(value: Period): PeriodUiModelBuilder {
        this.value = value;
        return this;
    }

    public async build(): Promise<PeriodUiModel> {
        if (!this.value) {
            throw new Error('Value is required');
        }

        return await this.buildPeriodUiModel(this.value)
    }

    private async buildPeriodUiModel(period: Period): Promise<PeriodUiModel> {
        const uiModel = <PeriodUiModel> {
            period: period,
            hasPeriodNote: false
        };

        return await this.periodEnhancer.enhance<PeriodUiModel>(uiModel);
    }
}