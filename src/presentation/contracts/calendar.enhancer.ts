import {PluginSettings} from 'src/domain/settings/plugin.settings';
import {CalendarUiModel} from 'src/presentation/models/calendar.ui-model';

export interface CalendarEnhancer {
    withSettings(settings: PluginSettings): CalendarEnhancer;
    enhance(calendar: CalendarUiModel): Promise<CalendarUiModel>;
}