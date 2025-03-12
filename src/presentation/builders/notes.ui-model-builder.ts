import {Note} from 'src/domain/models/note.model';
import {NotesUiModel} from 'src/presentation/models/notes.ui-model';
import {UiModelBuilder} from 'src/presentation/contracts/ui-model-builder';
import {PluginSettings} from 'src/domain/settings/plugin.settings';
import {NoteUiModel} from 'src/presentation/models/note.ui-model';
import {DateParserFactory} from 'src/infrastructure/contracts/date-parser-factory';
import {DisplayNotesSettings} from 'src/domain/settings/display-notes.settings';

export class NotesUiModelBuilder implements UiModelBuilder<Note[], NotesUiModel> {
    private settings: DisplayNotesSettings | null = null;
    private notes: Note[] = [];

    constructor(
        private readonly dateParserFactory: DateParserFactory
    ) {
    }

    public withSettings(settings: PluginSettings): void {
        this.settings = settings.notesSettings;
    }

    public withValue(value: Note[]): UiModelBuilder<Note[], NotesUiModel> {
        this.notes = value;
        return this;
    }

    public async build(): Promise<NotesUiModel> {
        const notes = this.notes.map(note => this.buildNoteUiModel(note));

        return <NotesUiModel> {
            lastUpdated: new Date(),
            notes: notes
        };
    }

    private buildNoteUiModel(note: Note): NoteUiModel {
        if (!this.settings) {
            throw new Error('Settings must be provided before building the UI model');
        }

        const displayDate = this.dateParserFactory.getParser()
            .fromDate(note.createdOn.date, this.settings.displayDateTemplate);

        return <NoteUiModel> {
            note: note,
            date: displayDate,
            name: note.name.removeMarkdownExtension(),
            filePath: note.path
        }
    }
}