import { PeriodNoteSettings } from 'src/domain/settings/period-note.settings';
import {PeriodEnhancer} from 'src/presentation/contracts/period.enhancer';
import {PeriodUiModel} from '../models/period.ui-model';
import {NoteAdapter} from 'src/infrastructure/adapters/note.adapter';

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