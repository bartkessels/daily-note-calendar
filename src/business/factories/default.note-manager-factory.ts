import {NoteManagerFactory} from 'src/business/contracts/note-manager-factory';
import {NoteManager} from 'src/business/contracts/note.manager';
import {RepositoryNoteManager} from 'src/business/managers/repository.note-manager';
import {FileRepositoryFactory} from 'src/infrastructure/contracts/file-repository-factory';
import {NoteRepositoryFactory} from 'src/infrastructure/contracts/note-repository-factory';

export class DefaultNoteManagerFactory implements NoteManagerFactory {
    constructor(
        private readonly fileRepositoryFactory: FileRepositoryFactory,
        private readonly noteRepositoryFactory: NoteRepositoryFactory
    ) {

    }

    public getManager(): NoteManager {
        return new RepositoryNoteManager(
            this.fileRepositoryFactory,
            this.noteRepositoryFactory
        );
    }
}