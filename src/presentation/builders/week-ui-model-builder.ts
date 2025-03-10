import {weekUiModel, WeekUiModel} from 'src/presentation/models/week.ui-model';
import {WeekModel} from 'src/domain/models/week.model';
import {NumberOfNotesPeriodEnhancer} from 'src/presentation/enhancers/number-of-notes.period-enhancer';
import {WeeklyNoteExistsPeriodEnhancer} from 'src/presentation/enhancers/weekly-note-exists.period-enhancer';
import {PluginSettings} from 'src/domain/settings/plugin.settings';
import {UiModelBuilder} from 'src/presentation/contracts/ui-model-builder';

export class WeekUiModelBuilder implements UiModelBuilder<WeekModel, WeekUiModel> {
    private model: WeekModel | null = null;

    constructor(
        private readonly numberOfNotesPeriodEnhancer: NumberOfNotesPeriodEnhancer,
        private readonly weeklyNoteExistsPeriodEnhancer: WeeklyNoteExistsPeriodEnhancer
    ) {

    }

    public withSettings(settings: PluginSettings): void {
        this.numberOfNotesPeriodEnhancer.withSettings(settings);
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
        let enhancedWeek = await this.numberOfNotesPeriodEnhancer.enhance<WeekUiModel>(defaultWeekUiModel);
        enhancedWeek = await this.weeklyNoteExistsPeriodEnhancer.enhance<WeekUiModel>(enhancedWeek);

        return enhancedWeek;
    }

}