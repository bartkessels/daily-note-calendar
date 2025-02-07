import {NoteRepositoryFactory} from 'src/infrastructure/contracts/note-repository-factory';
import {NoteAdapter} from 'src/infrastructure/adapters/note.adapter';
import {AdapterNoteRepository} from 'src/infrastructure/repositories/adapter.note-repository';
import {NoteRepository} from 'src/infrastructure/contracts/note-repository';

export class DefaultNoteRepositoryFactory implements NoteRepositoryFactory {
    constructor(
        private readonly adapter: NoteAdapter
    ) {

    }

    public getRepository(): NoteRepository {
        return new AdapterNoteRepository(this.adapter);
    }
}