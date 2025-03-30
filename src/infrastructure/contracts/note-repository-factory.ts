import {NoteRepository} from 'src/infrastructure/contracts/note-repository';

export interface NoteRepositoryFactory {
    getRepository(): NoteRepository;
}