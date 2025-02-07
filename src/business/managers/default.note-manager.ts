import {NoteManager} from 'src/business/contracts/note.manager';
import { Note } from 'src/domain/models/note.model';
import {FileRepositoryFactory} from 'src/infrastructure/contracts/file-repository-factory';
import {FileRepository} from 'src/infrastructure/contracts/file-repository';
import {NoteRepository} from 'src/infrastructure/contracts/note-repository';
import {NoteRepositoryFactory} from 'src/infrastructure/contracts/note-repository-factory';

export class DefaultNoteManager implements NoteManager {
    private readonly fileRepository: FileRepository;
    private readonly noteRepository: NoteRepository;

    constructor(
        fileRepositoryFactory: FileRepositoryFactory,
        noteRepositoryFactory: NoteRepositoryFactory
    ) {
        this.fileRepository = fileRepositoryFactory.getRepository();
        this.noteRepository = noteRepositoryFactory.getRepository();
    }

    public async openNote(note: Note): Promise<void> {
        await this.fileRepository.open(note.path);
    }

    public async deleteNote(note: Note): Promise<void> {
        await this.fileRepository.delete(note.path);
    }

    public async getActiveNote(): Promise<Note | null> {
        return await this.noteRepository.getActiveNote();
    }
}