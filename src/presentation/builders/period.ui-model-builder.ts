import {UiModelBuilder} from 'src/presentation/contracts/ui-model-builder';
import {Period} from 'src/domain/models/period.model';
import {periodUiModel, PeriodUiModel} from 'src/presentation/models/period.ui-model';
import {PluginSettings} from 'src/domain/settings/plugin.settings';
import {PeriodNoteExistsPeriodEnhancer} from 'src/presentation/enhancers/period-note-exists.period-enhancer';
import {CreatedNotesPeriodEnhancer} from 'src/presentation/enhancers/created-notes.period-enhancer';

export class PeriodUiModelBuilder implements UiModelBuilder<Period, PeriodUiModel> {
    private value: Period | null = null;

    constructor(
        private readonly createdNotesPeriodEnhancer: CreatedNotesPeriodEnhancer,
        private readonly periodNoteExistsPeriodEnhancer: PeriodNoteExistsPeriodEnhancer
    ) {

    }

    public withSettings(settings: PluginSettings): void {
        this.createdNotesPeriodEnhancer.withSettings(settings);
        this.periodNoteExistsPeriodEnhancer.withSettings(settings);
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
        let enhancedUiModel = await this.createdNotesPeriodEnhancer.enhance<PeriodUiModel>(defaultPeriodUiModel);
        enhancedUiModel = await this.periodNoteExistsPeriodEnhancer.enhance<PeriodUiModel>(enhancedUiModel);

        return enhancedUiModel;
    }
}