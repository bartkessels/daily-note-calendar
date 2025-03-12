import {NoteManager} from 'src/business/contracts/note.manager';
import { Note } from 'src/domain/models/note.model';
import {FileRepositoryFactory} from 'src/infrastructure/contracts/file-repository-factory';
import {NoteRepositoryFactory} from 'src/infrastructure/contracts/note-repository-factory';
import {arePeriodsEqual, Period} from 'src/domain/models/period.model';

export class RepositoryNoteManager implements NoteManager {
    constructor(
        private readonly fileRepositoryFactory: FileRepositoryFactory,
        private readonly noteRepositoryFactory: NoteRepositoryFactory
    ) {

    }

    public async openNote(note: Note): Promise<void> {
        const fileRepository = this.fileRepositoryFactory.getRepository();
        const doesNoteExist = await fileRepository.exists(note.path);

        if (doesNoteExist) {
            await this.fileRepositoryFactory.getRepository().open(note.path);
        }
    }

    public async getNotesForPeriod(period: Period): Promise<Note[]> {
        const noteRepository = this.noteRepositoryFactory.getRepository();

        return await noteRepository.getNotes(note => {
            return arePeriodsEqual(note.createdOn, period);
        });
    }

    public async deleteNote(note: Note): Promise<void> {
        const fileRepository = this.fileRepositoryFactory.getRepository();
        const doesNoteExist = await fileRepository.exists(note.path);

        if (doesNoteExist) {
            await this.fileRepositoryFactory.getRepository().delete(note.path);
        }
    }

    public async getActiveNote(): Promise<Note | null> {
        return await this.noteRepositoryFactory.getRepository().getActiveNote();
    }
}