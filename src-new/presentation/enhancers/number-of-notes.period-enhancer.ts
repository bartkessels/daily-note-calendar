import { PeriodNoteSettings } from 'src-new/domain/settings/period-note.settings';
import {PeriodEnhancer} from 'src-new/presentation/contracts/period.enhancer';
import {PeriodUiModel} from '../models/period.ui-model';
import {NoteAdapter} from 'src-new/infrastructure/adapters/note.adapter';

export class NumberOfNotesPeriodEnhancer implements PeriodEnhancer {
    constructor(
        private readonly noteAdapter: NoteAdapter
    ) {

    }

    public withSettings(_: PeriodNoteSettings): void {
        // We don't need any settings for this enhancer.
    }

    public async enhance(period: PeriodUiModel[]): Promise<PeriodUiModel[]> {
        return Promise.all(period.map(p => this.enhancePeriod(p)));
    }

    private async enhancePeriod(period: PeriodUiModel): Promise<PeriodUiModel> {
        const notes = await this.noteAdapter.getNotes(note =>
            note.createdOn.toDateString() === period.period.date.toDateString()
        );
        const noNotesForPeriod = notes.length;

        return {
            ...period,
            noNotes: noNotesForPeriod
        };
    }
}