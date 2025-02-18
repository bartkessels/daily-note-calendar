import {PeriodUiModel} from 'src/presentation/models/period.ui-model';
import {PluginSettings} from 'src/domain/settings/plugin.settings';

export interface PeriodEnhancer {
    withSettings(settings: PluginSettings): PeriodEnhancer;
    enhance<T extends PeriodUiModel>(period: PeriodUiModel[]): Promise<T[]>;
}