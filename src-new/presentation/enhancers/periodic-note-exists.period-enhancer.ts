import { Period } from 'src-new/domain/models/period.model';
import { PeriodNoteSettings } from 'src-new/domain/settings/period-note.settings';
import {PeriodEnhancer} from 'src-new/presentation/contracts/period.enhancer';
import {PeriodUiModel} from '../models/period.ui-model';
import {NameBuilder} from 'src-new/business/contracts/name-builder';
import {FileAdapter} from 'src-new/infrastructure/adapters/file.adapter';

export class PeriodicNoteExistsPeriodEnhancer implements PeriodEnhancer {
    private settings: PeriodNoteSettings | undefined;

    constructor(
        private readonly nameBuilder: NameBuilder<Period>,
        private readonly fileAdapter: FileAdapter
    ) {

    }

    public withSettings(settings: PeriodNoteSettings): void {
        this.settings = settings;
    }

    public async enhance(period: PeriodUiModel[]): Promise<PeriodUiModel[]> {
        const settings = this.settings;

        if (!settings) {
            throw new Error('Settings not set.');
        }

        return Promise.all(period.map(p => this.enhancePeriod(settings, p)));
    }

    private async enhancePeriod(settings: PeriodNoteSettings, period: PeriodUiModel): Promise<PeriodUiModel> {
        const filePath = this.nameBuilder
            .withPath(settings.folderTemplate)
            .withName(settings.nameTemplate)
            .withValue(period.period)
            .build();

        const fileExists = await this.fileAdapter.exists(filePath);

        return {
            ...period,
            hasPeriodNote: fileExists
        };
    }
}