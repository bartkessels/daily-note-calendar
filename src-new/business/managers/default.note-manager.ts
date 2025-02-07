import {NoteManager} from 'src-new/business/contracts/note.manager';
import { Note } from 'src-new/domain/models/note.model';
import {FileRepositoryFactory} from 'src-new/infrastructure/contracts/file-repository-factory';
import {FileRepository} from 'src-new/infrastructure/contracts/file-repository';

export class DefaultNoteManager implements NoteManager {
    private readonly fileRepository: FileRepository;

    constructor(fileRepositoryFactory: FileRepositoryFactory) {
        this.fileRepository = fileRepositoryFactory.getRepository();
    }

    public async openNote(note: Note): Promise<void> {
        await this.fileRepository.open(note.path);
    }

    public async deleteNote(note: Note): Promise<void> {
        await this.fileRepository.delete(note.path);
    }
}