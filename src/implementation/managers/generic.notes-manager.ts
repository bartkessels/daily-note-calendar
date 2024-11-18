import {Note} from 'src/domain/models/note';
import {Event} from 'src/domain/events/event';
import {FileService} from 'src/domain/services/file.service';
import {NoteRepository} from 'src/domain/repositories/note.repository';
import {NotesManager} from 'src/domain/managers/notes.manager';
import {Day} from 'src/domain/models/day';
import {SettingsRepository} from 'src/domain/repositories/settings.repository';
import {GeneralSettings} from 'src/domain/models/settings/general.settings';

export class GenericNotesManager implements NotesManager {
    constructor(
        event: Event<Note>,
        private readonly fileService: FileService,
        private readonly noteRepository: NoteRepository<Day>,
        private readonly settingsRepository: SettingsRepository<GeneralSettings>
    ) {
        event.onEvent((note) => this.tryOpenNote(note));
    }

    public async tryOpenNote(note: Note) : Promise<void> {
        return this.fileService.tryOpenFile(note.path);
    }

    public async getNotesCreatedOn(day: Day): Promise<Note[]> {
        const settings = await this.settingsRepository.getSettings();

        if (!settings.displayNotesCreatedOnDate) {
            return [];
        }

        return this.noteRepository.getNotesCreatedOn(day);
    }
}