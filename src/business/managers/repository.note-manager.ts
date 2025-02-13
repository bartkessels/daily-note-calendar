import {NoteManager} from 'src/business/contracts/note.manager';
import { Note } from 'src/domain/models/note.model';
import {FileRepositoryFactory} from 'src/infrastructure/contracts/file-repository-factory';
import {NoteRepositoryFactory} from 'src/infrastructure/contracts/note-repository-factory';
import {SettingsRepositoryFactory, SettingsType} from 'src/infrastructure/contracts/settings-repository-factory';
import {DisplayNotesSettings} from 'src/domain/settings/display-notes.settings';
import {DateRepositoryFactory} from 'src/infrastructure/contracts/date-repository-factory';

export class RepositoryNoteManager implements NoteManager {
    constructor(
        private readonly fileRepositoryFactory: FileRepositoryFactory,
        private readonly noteRepositoryFactory: NoteRepositoryFactory,
        private readonly settingsRepositoryFactory: SettingsRepositoryFactory,
        private readonly dateRepositoryFactory: DateRepositoryFactory
    ) {

    }

    public async openNote(note: Note): Promise<void> {
        await this.fileRepositoryFactory.getRepository().open(note.path);
    }

    public async deleteNote(note: Note): Promise<void> {
        await this.fileRepositoryFactory.getRepository().delete(note.path);
    }

    public async getActiveNote(): Promise<Note | null> {
        const note = await this.noteRepositoryFactory.getRepository().getActiveNote();
        return this.setCreatedOnProperty(note);
    }

    private async setCreatedOnProperty(note: Note | null): Promise<Note | null> {
        const settings = await this.settingsRepositoryFactory
            .getRepository<DisplayNotesSettings>(SettingsType.DisplayNotes)
            .get();
        const property = note?.properties?.get(settings.createdOnDatePropertyName);

        if (!note || !settings.useCreatedOnDateFromProperties || !property) {
            return note;
        }

        const date = this.dateRepositoryFactory.getRepository()
            .getDayFromDateString(property, settings.createdOnPropertyFormat);

        return {
            ...note,
            createdOnProperty: date ?? undefined
        }
    }
}