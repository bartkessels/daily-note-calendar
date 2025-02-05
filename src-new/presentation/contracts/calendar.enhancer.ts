import {PluginSettings} from 'src-new/domain/settings/plugin.settings';
import {CalendarUiModel} from 'src-new/presentation/models/calendar.ui-model';

export interface CalendarEnhancer {
    withSettings(settings: PluginSettings): CalendarEnhancer;
    enhance(calendar: CalendarUiModel): Promise<CalendarUiModel>;
}