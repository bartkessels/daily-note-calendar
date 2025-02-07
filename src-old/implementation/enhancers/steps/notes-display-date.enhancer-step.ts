import {EnhancerStep} from 'src-old/domain/enhancers/enhancer-step';
import {NoteUiModel} from 'src-old/components/models/note.ui-model';
import {SettingsRepository} from 'src-old/domain/repositories/settings.repository';
import {DateParser} from 'src-old/domain/parsers/date.parser';
import {NotesSettings} from 'src-old/domain/models/settings/notes.settings';

export class NotesDisplayDateEnhancerStep implements EnhancerStep<NoteUiModel[]> {
    constructor(
        private readonly settingsRepository: SettingsRepository<NotesSettings>,
        private readonly dateParser: DateParser
    ) {

    }

    public async execute(notes?: NoteUiModel[]): Promise<NoteUiModel[] | undefined> {
        const settings = await this.settingsRepository.getSettings();
        return notes?.map((note) => this.enhanceNote(note, settings));
    }

    private enhanceNote(note: NoteUiModel, settings: NotesSettings): NoteUiModel {
        const displayDate = this.dateParser.parse(note.note.createdOn, settings.displayDateTemplate);

        return {
            ...note,
            displayDate: displayDate
        };
    }
}