import { Note } from 'src/domain/models/note.model';
import {NoteRepository} from 'src/infrastructure/contracts/note-repository';
import {NoteAdapter} from 'src/infrastructure/adapters/note.adapter';
import {DateParserFactory} from 'src/infrastructure/contracts/date-parser-factory';
import {SettingsRepositoryFactory, SettingsType} from 'src/infrastructure/contracts/settings-repository-factory';
import {DisplayNotesSettings} from 'src/domain/settings/display-notes.settings';

export class AdapterNoteRepository implements NoteRepository {
    constructor(
        private readonly adapter: NoteAdapter,
        private readonly dateParserFactory: DateParserFactory,
        private readonly settingsRepositoryFactory: SettingsRepositoryFactory
    ) {

    }

    public async getActiveNote(): Promise<Note | null> {
        return await this.adapter.getActiveNote();
    }

    public async getNotes(filter: (note: Note) => boolean): Promise<Note[]> {
        const notes = await this.adapter.getNotes();
        return notes.filter(filter);
    }

    private async setCreatedOnProperty(notes: Note[]): Promise<Note[]> {
        const settings = await this.settingsRepositoryFactory
            .getRepository<DisplayNotesSettings>(SettingsType.DisplayNotes)
            .get();

        return notes.map(note => {
            const property = note.properties.get(settings.createdOnDatePropertyName);

            if (!property) {
                return note;
            }

            return <Note> {
                ...note,
                createdOnProperty: this.dateParserFactory.getParser().fromString(property, settings.createdOnPropertyFormat)
            };
        });
    }
}