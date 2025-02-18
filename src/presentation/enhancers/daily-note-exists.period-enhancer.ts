import {Period, PeriodType} from 'src/domain/models/period.model';
import {PeriodNoteSettings} from 'src/domain/settings/period-note.settings';
import {PeriodEnhancer} from 'src/presentation/contracts/period.enhancer';
import {PeriodUiModel} from '../models/period.ui-model';
import {NameBuilder} from 'src/business/contracts/name-builder';
import {FileAdapter} from 'src/infrastructure/adapters/file.adapter';
import {PluginSettings} from 'src/domain/settings/plugin.settings';

export class DailyNoteExistsPeriodEnhancer implements PeriodEnhancer {
    private settings: PeriodNoteSettings | undefined;

    constructor(
        private readonly nameBuilder: NameBuilder<Period>,
        private readonly fileAdapter: FileAdapter
    ) {

    }

    public withSettings(settings: PluginSettings): PeriodEnhancer {
        this.settings = settings.dailyNotes;
        return this;
    }

    public async enhance<T extends PeriodUiModel>(period: PeriodUiModel[]): Promise<T[]> {
        const settings = this.settings;

        if (!settings) {
            throw new Error('Settings not set.');
        }

        return Promise.all(period.map(p => this.enhancePeriod<T>(settings, p)));
    }

    private async enhancePeriod<T extends PeriodUiModel>(settings: PeriodNoteSettings, period: PeriodUiModel): Promise<T> {
        if (period.period.type !== PeriodType.Day) {
            return period as T;
        }

        const filePath = this.nameBuilder
            .withPath(settings.folder)
            .withName(settings.nameTemplate)
            .withValue(period.period)
            .build();
        const fileExists = await this.fileAdapter.exists(filePath);

        return <T>{
            ...period,
            hasPeriodNote: fileExists
        };
    }
}