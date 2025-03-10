import {UiModelBuilder} from 'src/presentation/contracts/ui-model-builder';
import {Period} from 'src/domain/models/period.model';
import {periodUiModel, PeriodUiModel} from 'src/presentation/models/period.ui-model';
import {PluginSettings} from 'src/domain/settings/plugin.settings';
import {NumberOfNotesPeriodEnhancer} from 'src/presentation/enhancers/number-of-notes.period-enhancer';

export class PeriodUiModelBuilder implements UiModelBuilder<Period, PeriodUiModel> {
    private value: Period | null = null;

    constructor(
        private readonly numberOfNotesPeriodEnhancer: NumberOfNotesPeriodEnhancer
    ) {

    }

    public withSettings(settings: PluginSettings): void {
        this.numberOfNotesPeriodEnhancer.withSettings(settings);
    }

    public withValue(value: Period): PeriodUiModelBuilder {
        this.value = value;
        return this;
    }

    public async build(): Promise<PeriodUiModel> {
        if (!this.value) {
            throw new Error('Value is required');
        }

        const defaultPeriodUiModel = periodUiModel(this.value);
        return await this.numberOfNotesPeriodEnhancer.enhance<PeriodUiModel>(defaultPeriodUiModel);
    }
}