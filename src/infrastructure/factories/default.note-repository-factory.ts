import {NoteRepositoryFactory} from 'src/infrastructure/contracts/note-repository-factory';
import {NoteAdapter} from 'src/infrastructure/adapters/note.adapter';
import {AdapterNoteRepository} from 'src/infrastructure/repositories/adapter.note-repository';
import {NoteRepository} from 'src/infrastructure/contracts/note-repository';
import {DateParserFactory} from 'src/infrastructure/contracts/date-parser-factory';
import {SettingsRepositoryFactory} from 'src/infrastructure/contracts/settings-repository-factory';

export class DefaultNoteRepositoryFactory implements NoteRepositoryFactory {
    constructor(
        private readonly adapter: NoteAdapter,
        private readonly dateParserFactory: DateParserFactory,
        private readonly settingsRepositoryFactory: SettingsRepositoryFactory
    ) {

    }

    public getRepository(): NoteRepository {
        return new AdapterNoteRepository(this.adapter, this.dateParserFactory, this.settingsRepositoryFactory);
    }
}