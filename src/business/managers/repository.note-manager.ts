import {NoteManager} from 'src/business/contracts/note.manager';
import {Note, SortNotes} from 'src/domain/models/note.model';
import {FileRepositoryFactory} from 'src/infrastructure/contracts/file-repository-factory';
import {NoteRepositoryFactory} from 'src/infrastructure/contracts/note-repository-factory';
import {arePeriodsEqual, Period} from 'src/domain/models/period.model';
import {SettingsRepositoryFactory, SettingsType} from 'src/infrastructure/contracts/settings-repository-factory';
import {DisplayNotesSettings} from 'src/domain/settings/display-notes.settings';
import {GeneralSettings} from 'src/domain/settings/general.settings';

export class RepositoryNoteManager implements NoteManager {
    constructor(
        private readonly fileRepositoryFactory: FileRepositoryFactory,
        private readonly noteRepositoryFactory: NoteRepositoryFactory,
        private readonly settingsRepositoryFactory: SettingsRepositoryFactory
    ) {

    }

    public async openNote(note: Note): Promise<void> {
        const fileRepository = this.fileRepositoryFactory.getRepository();
        const doesNoteExist = await fileRepository.exists(note.path);

        if (doesNoteExist) {
            await this.fileRepositoryFactory.getRepository().openInCurrentTab(note.path);
        }
    }

    public async openNoteInHorizontalSplitView(note: Note): Promise<void> {
        const fileRepository = this.fileRepositoryFactory.getRepository();
        const doesNoteExist = await fileRepository.exists(note.path);

        if (doesNoteExist) {
            await this.fileRepositoryFactory.getRepository().openInHorizontalSplitView(note.path);
        }
    }

    public async openNoteInVerticalSplitView(note: Note): Promise<void> {
        const fileRepository = this.fileRepositoryFactory.getRepository();
        const doesNoteExist = await fileRepository.exists(note.path);

        if (doesNoteExist) {
            await this.fileRepositoryFactory.getRepository().openInVerticalSplitView(note.path);
        }
    }

    public async getNotesForPeriod(period: Period): Promise<Note[]> {
        const generalSettings = await this.settingsRepositoryFactory
            .getRepository<GeneralSettings>(SettingsType.General)
            .get();

        if (!generalSettings.displayNotesCreatedOnDate) {
            return [];
        }

        const displayNotesSettings = await this.settingsRepositoryFactory
            .getRepository<DisplayNotesSettings>(SettingsType.DisplayNotes)
            .get();

        const noteRepository = this.noteRepositoryFactory.getRepository();
        const notes = await noteRepository.getNotes(note => {
            if (displayNotesSettings.useCreatedOnDateFromProperties) {
                return arePeriodsEqual(note.createdOnProperty, period);
            }

            return arePeriodsEqual(note.createdOn, period);
        });

        if (displayNotesSettings.sortNotes === SortNotes.Ascending) {
            return notes.sort((a, b) => a.createdOn.date.getTime() - b.createdOn.date.getTime());
        } else {
            return notes.sort((a, b) => b.createdOn.date.getTime() - a.createdOn.date.getTime());
        }
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