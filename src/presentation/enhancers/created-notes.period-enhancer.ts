import {PeriodEnhancer} from 'src/presentation/contracts/period.enhancer';
import {DisplayNotesSettings} from 'src/domain/settings/display-notes.settings';
import {NoteAdapter} from 'src/infrastructure/adapters/note.adapter';
import {PluginSettings} from 'src/domain/settings/plugin.settings';
import {PeriodUiModel} from 'src/presentation/models/period.ui-model';
import {arePeriodsEqual} from 'src/domain/models/period.model';
import {NoteUiModel} from 'src/presentation/models/note.ui-model';
import {DateParserFactory} from 'src/infrastructure/contracts/date-parser-factory';
import {Note} from 'src/domain/models/note.model';

export class CreatedNotesPeriodEnhancer implements PeriodEnhancer {
    private settings: DisplayNotesSettings | undefined;

    constructor(
        private readonly noteAdapter: NoteAdapter,
        private readonly dateParserFactory: DateParserFactory
    ) {

    }

    public withSettings(settings: PluginSettings): PeriodEnhancer {
        this.settings = settings.notesSettings;
        return this;
    }

    public async enhance<T extends PeriodUiModel>(period: PeriodUiModel): Promise<T> {
        const settings = this.settings;
        if (!settings) {
            throw new Error('Settings not set');
        }

        const notes = await this.noteAdapter.getNotes(note => {
            if (settings.useCreatedOnDateFromProperties && note.createdOnProperty) {
                return arePeriodsEqual(note.createdOnProperty, period.period);
            } else if (!settings.useCreatedOnDateFromProperties) {
                return arePeriodsEqual(note.createdOn, period.period);
            }

            return false;
        });
        const noteUiModels = this.buildUiModels(notes, settings);

        return <T>{
            ...period,
            notes: noteUiModels
        };
    }

    private buildUiModels(notes: Note[], settings: DisplayNotesSettings): NoteUiModel[] {
        return notes.map(note => this.buildUiModel(note, settings));
    }

    private buildUiModel(note: Note, settings: DisplayNotesSettings): NoteUiModel {
        const dateParser = this.dateParserFactory.getParser();
        const displayDate = dateParser.fromDate(note.createdOn.date, settings.displayDateTemplate);

        return <NoteUiModel> {
            note: note,
            date: displayDate,
            name: note.name.removeMarkdownExtension(),
            filePath: note.path
        };
    }
}