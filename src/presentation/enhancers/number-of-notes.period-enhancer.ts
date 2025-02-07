import { PeriodNoteSettings } from 'src/domain/settings/period-note.settings';
import {PeriodEnhancer} from 'src/presentation/contracts/period.enhancer';
import {PeriodUiModel} from '../models/period.ui-model';
import {NoteAdapter} from 'src/infrastructure/adapters/note.adapter';
import {PeriodType} from 'src/domain/models/period.model';

export class NumberOfNotesPeriodEnhancer implements PeriodEnhancer {
    constructor(
        private readonly noteAdapter: NoteAdapter
    ) {

    }

    public withSettings(_: PeriodNoteSettings): PeriodEnhancer {
        // We don't need any settings for this enhancer.
        return this;
    }

    public async enhance<T extends PeriodUiModel>(period: PeriodUiModel[]): Promise<T[]> {
        return Promise.all(period.map(p => this.enhancePeriod<T>(p)));
    }

    private async enhancePeriod<T extends PeriodUiModel>(period: PeriodUiModel): Promise<T> {
        if (period.period.type !== PeriodType.Day && period.period.type !== PeriodType.Week) {
            return period as T;
        }

        const notes = await this.noteAdapter.getNotes(note =>
            note.createdOn.toDateString() === period.period.date.toDateString()
        );
        const noNotesForPeriod = notes.length;

        return<T> {
            ...period,
            noNotes: noNotesForPeriod
        };
    }
}