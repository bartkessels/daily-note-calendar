import { Note } from 'src/domain/models/note.model';
import {NoteRepository} from 'src/infrastructure/contracts/note-repository';
import {NoteAdapter} from 'src/infrastructure/adapters/note.adapter';
import {SettingsRepositoryFactory, SettingsType} from 'src/infrastructure/contracts/settings-repository-factory';
import {DisplayNotesSettings} from 'src/domain/settings/display-notes.settings';
import {DateRepositoryFactory} from 'src/infrastructure/contracts/date-repository-factory';
import {DateParserFactory} from 'src/infrastructure/contracts/date-parser-factory';

export class AdapterNoteRepository implements NoteRepository {
    constructor(
        private readonly adapter: NoteAdapter,
        private readonly dateRepositoryFactory: DateRepositoryFactory,
        private readonly dateParserFactory: DateParserFactory,
        private readonly settingsRepositoryFactory: SettingsRepositoryFactory
    ) {

    }

    public async getActiveNote(): Promise<Note | null> {
        const settings = await this.settingsRepositoryFactory
            .getRepository<DisplayNotesSettings>(SettingsType.DisplayNotes)
            .get();
        const activeNote = await this.adapter.getActiveNote();

        if (!activeNote) {
            return null;
        }

        return this.setDateProperty(activeNote, settings);
    }

    public async getNotes(filter: (note: Note) => boolean): Promise<Note[]> {
        const notes = await this.adapter.getNotes();
        const notesWithProperties = await this.setDateProperties(notes);
        return notesWithProperties.filter(filter);
    }

    private async setDateProperties(notes: Note[]): Promise<Note[]> {
        const settings = await this.settingsRepositoryFactory
            .getRepository<DisplayNotesSettings>(SettingsType.DisplayNotes)
            .get();

        return notes
            .map(note => this.setDateProperty(note, settings));
    }

    private setDateProperty(note: Note, settings: DisplayNotesSettings): Note {
        const updatedNote = this.setCreatedOnProperty(note, settings);
        let createdOnDate = updatedNote.createdOn.date;

        if (updatedNote.createdOnProperty && settings.useCreatedOnDateFromProperties) {
            createdOnDate = updatedNote.createdOnProperty.date;
        }

        return <Note> {
            ...updatedNote,
            displayDate: this.dateParserFactory.getParser().fromDate(createdOnDate, settings.displayDateTemplate)
        }
    }

    private setCreatedOnProperty(note: Note, settings: DisplayNotesSettings): Note {
        const property = note.properties.get(settings.createdOnDatePropertyName);

        if (!property) {
            return note;
        }

        const createdOnPeriod = this.dateRepositoryFactory.getRepository()
            .getDayFromDateString(property, settings.createdOnPropertyFormat);

        if (createdOnPeriod && createdOnPeriod.date.getHours() === 0 && createdOnPeriod.date.getMinutes() === 0) {
            createdOnPeriod.date.setHours(
                note.createdOn.date.getHours(),
                note.createdOn.date.getMinutes(),
                note.createdOn.date.getSeconds(),
                note.createdOn.date.getMilliseconds()
            );
        }

        return <Note> {
            ...note,
            createdOnProperty: createdOnPeriod
        };
    }
}