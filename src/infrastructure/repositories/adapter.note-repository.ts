import { Note } from 'src/domain/models/note.model';
import {NoteRepository} from 'src/infrastructure/contracts/note-repository';
import {NoteAdapter} from 'src/infrastructure/adapters/note.adapter';
import {SettingsRepositoryFactory, SettingsType} from 'src/infrastructure/contracts/settings-repository-factory';
import {DisplayNotesSettings} from 'src/domain/settings/display-notes.settings';
import {DateRepositoryFactory} from 'src/infrastructure/contracts/date-repository-factory';

export class AdapterNoteRepository implements NoteRepository {
    constructor(
        private readonly adapter: NoteAdapter,
        private readonly dateRepositoryFactory: DateRepositoryFactory,
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

        return this.setCreatedOnProperty(activeNote, settings);
    }

    public async getNotes(filter: (note: Note) => boolean): Promise<Note[]> {
        const notes = await this.adapter.getNotes();
        const notesWithProperties = await this.setCreatedOnProperties(notes);
        return notesWithProperties.filter(filter);
    }

    private async setCreatedOnProperties(notes: Note[]): Promise<Note[]> {
        const settings = await this.settingsRepositoryFactory
            .getRepository<DisplayNotesSettings>(SettingsType.DisplayNotes)
            .get();

        return notes.map(note => this.setCreatedOnProperty(note, settings));
    }

    private setCreatedOnProperty(note: Note, settings: DisplayNotesSettings): Note {
        const property = note.properties.get(settings.createdOnDatePropertyName);

        if (!property) {
            return note;
        }

        const createdOnPeriod = this.dateRepositoryFactory.getRepository()
            .getDayFromDateString(property, settings.createdOnPropertyFormat);

        if (createdOnPeriod) {
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