import {NoteManager} from 'src/business/contracts/note.manager';
import { Note } from 'src/domain/models/note.model';
import {FileRepositoryFactory} from 'src/infrastructure/contracts/file-repository-factory';
import {FileRepository} from 'src/infrastructure/contracts/file-repository';
import {NoteRepository} from 'src/infrastructure/contracts/note-repository';
import {NoteRepositoryFactory} from 'src/infrastructure/contracts/note-repository-factory';
import {SettingsRepositoryFactory, SettingsType} from 'src/infrastructure/contracts/settings-repository-factory';
import {SettingsRepository} from 'src/infrastructure/contracts/settings-repository';
import {DisplayNotesSettings} from 'src/domain/settings/display-notes.settings';
import {DateRepositoryFactory} from 'src/infrastructure/contracts/date-repository-factory';
import {DateRepository} from 'src/infrastructure/contracts/date-repository';

export class RepositoryNoteManager implements NoteManager {
    private readonly fileRepository: FileRepository;
    private readonly noteRepository: NoteRepository;
    private readonly settingsRepository: SettingsRepository<DisplayNotesSettings>;
    private readonly dateRepository: DateRepository;

    constructor(
        fileRepositoryFactory: FileRepositoryFactory,
        noteRepositoryFactory: NoteRepositoryFactory,
        settingsRepositoryFactory: SettingsRepositoryFactory,
        dateRepositoryFactory: DateRepositoryFactory
    ) {
        this.fileRepository = fileRepositoryFactory.getRepository();
        this.noteRepository = noteRepositoryFactory.getRepository();
        this.settingsRepository = settingsRepositoryFactory.getRepository<DisplayNotesSettings>(SettingsType.DisplayNotes);
        this.dateRepository = dateRepositoryFactory.getRepository();
    }

    public async openNote(note: Note): Promise<void> {
        await this.fileRepository.open(note.path);
    }

    public async deleteNote(note: Note): Promise<void> {
        await this.fileRepository.delete(note.path);
    }

    public async getActiveNote(): Promise<Note | null> {
        const note = await this.noteRepository.getActiveNote();
        return this.setCreatedOnProperty(note);
    }

    private async setCreatedOnProperty(note: Note | null): Promise<Note | null> {
        const settings = await this.settingsRepository.get();
        const property = note?.properties?.get(settings.createdOnDatePropertyName);

        if (!note || !settings.useCreatedOnDateFromProperties || !property) {
            return note;
        }

        const date = this.dateRepository.getDayFromDateString(property, settings.createdOnPropertyFormat);

        return {
            ...note,
            createdOnProperty: date ?? undefined
        }
    }
}