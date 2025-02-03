import {PeriodNoteSettings} from 'src-new/domain/settings/period-note.settings';
import {PeriodUiModel} from 'src-new/presentation/models/period.ui-model';

export interface PeriodEnhancer {
    withSettings(settings: PeriodNoteSettings): void;
    enhance(period: PeriodUiModel[]): Promise<PeriodUiModel[]>;
}