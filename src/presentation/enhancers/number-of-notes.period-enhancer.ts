import {PeriodEnhancer} from 'src/presentation/contracts/period.enhancer';
import {PeriodUiModel} from 'src/presentation/models/period.ui-model';
import {NoteAdapter} from 'src/infrastructure/adapters/note.adapter';
import {arePeriodsEqual} from 'src/domain/models/period.model';
import {DisplayNotesSettings} from 'src/domain/settings/display-notes.settings';
import {PluginSettings} from 'src/domain/settings/plugin.settings';

export class NumberOfNotesPeriodEnhancer implements PeriodEnhancer {
    private settings: DisplayNotesSettings | undefined;

    constructor(
        private readonly noteAdapter: NoteAdapter
    ) {

    }

    public withSettings(settings: PluginSettings): PeriodEnhancer {
        this.settings = settings.notesSettings;
        return this;
    }

    public async enhance<T extends PeriodUiModel>(period: PeriodUiModel[]): Promise<T[]> {
        return Promise.all(period.map(p => this.enhancePeriod<T>(p)));
    }

    private async enhancePeriod<T extends PeriodUiModel>(period: PeriodUiModel): Promise<T> {
        const notes = await this.noteAdapter.getNotes(note => {
            if (this?.settings?.useCreatedOnDateFromProperties && note.createdOnProperty) {
                return arePeriodsEqual(note.createdOnProperty, period.period);
            }

            return arePeriodsEqual(note.createdOn, period.period)
        });
        const noNotesForPeriod = notes.length;

        return <T>{
            ...period,
            noNotes: noNotesForPeriod
        };
    }
}