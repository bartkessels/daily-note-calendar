import { EnhancerStep } from "src/domain/enhancers/enhancer-step";
import {NoteUiModel} from 'src/components/models/note.ui-model';
import {SettingsRepository} from 'src/domain/repositories/settings.repository';
import {NotesSettings} from 'src/domain/models/settings/notes.settings';
import {DateParser} from 'src/domain/parsers/date.parser';

export class DisplayDateNotesEnhancerStep implements EnhancerStep<NoteUiModel[]> {
    constructor(
        private readonly settingsRepository: SettingsRepository<NotesSettings>,
        private readonly dateParser: DateParser
    ) {

    }

    public async execute(value: NoteUiModel[]): Promise<NoteUiModel[]> {
        const settings = await this.settingsRepository.getSettings();
        return value?.map((note) => this.enhanceNote(note, settings));
    }

    private enhanceNote(note: NoteUiModel, settings: NotesSettings): NoteUiModel {
        const displayDate = this.dateParser.parse(note.note.createdOn, settings.displayDateTemplate);

        return {
            ...note,
            displayDate: displayDate
        };
    }
}