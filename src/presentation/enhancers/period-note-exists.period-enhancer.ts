import {PeriodType} from 'src/domain/models/period.model';
import {PeriodNoteSettings} from 'src/domain/settings/period-note.settings';
import {PeriodEnhancer} from 'src/presentation/contracts/period.enhancer';
import {PeriodUiModel} from '../models/period.ui-model';
import {PluginSettings} from 'src/domain/settings/plugin.settings';
import {PeriodicNoteManager} from 'src/business/contracts/periodic-note.manager';

export class PeriodNoteExistsPeriodEnhancer implements PeriodEnhancer {
    private settings: PluginSettings | undefined;

    constructor(
        private readonly periodicNoteManager: PeriodicNoteManager
    ) {

    }

    public withSettings(settings: PluginSettings): PeriodEnhancer {
        this.settings = settings;
        return this;
    }

    public async enhance<T extends PeriodUiModel>(period: PeriodUiModel): Promise<T> {
        const settings = this.getSettings(period.period.type);
        const fileExists = await this.periodicNoteManager.doesNoteExist(settings, period.period);

        return <T>{
            ...period,
            hasPeriodNote: fileExists
        };
    }

    private getSettings(type: PeriodType): PeriodNoteSettings {
        if (!this.settings) {
            throw new Error('Settings not set');
        }

        switch (type) {
            case PeriodType.Day:
                return this.settings.dailyNotes;
            case PeriodType.Week:
                return this.settings.weeklyNotes;
            case PeriodType.Month:
                return this.settings.monthlyNotes;
            case PeriodType.Quarter:
                return this.settings.quarterlyNotes;
            case PeriodType.Year:
                return this.settings.yearlyNotes;
        }
    }
}