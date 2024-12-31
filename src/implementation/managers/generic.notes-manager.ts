import {Note} from 'src/domain/models/note';
import {Event} from 'src/domain/events/event';
import {FileService} from 'src/domain/services/file.service';
import {NoteRepository} from 'src/domain/repositories/note.repository';
import {NotesManager} from 'src/domain/managers/notes.manager';
import {Day} from 'src/domain/models/day';
import {SettingsRepository} from 'src/domain/repositories/settings.repository';
import {GeneralSettings} from 'src/domain/models/settings/general.settings';

export class GenericNotesManager implements NotesManager {
    private selectedDay: Day | undefined;

    constructor(
        noteEvent: Event<Note>,
        dailyNoteEvent: Event<Day>,
        selectDayEvent: Event<Day>,
        deleteNoteEvent: Event<Note>,
        private readonly refreshNotesEvent: Event<Note[]>,
        private readonly fileService: FileService,
        private readonly noteRepository: NoteRepository<Day>,
        private readonly settingsRepository: SettingsRepository<GeneralSettings>
    ) {
        noteEvent.onEvent('GenericNotesManager', (note) => this.tryOpenNote(note));
        dailyNoteEvent.onEvent('GenericNotesManager', (day) => this.refreshNotesCreatedOn(day));
        selectDayEvent.onEvent('GenericNotesManager', (day) => this.refreshNotesCreatedOn(day));
        deleteNoteEvent.onEvent('GenericNotesManager', (note) => this.deleteNote(note));
    }

    public async tryOpenNote(note: Note) : Promise<void> {
        return this.fileService.tryOpenFile(note.path);
    }

    public async refreshNotes(): Promise<void> {
        const settings = await this.settingsRepository.getSettings();
        if (!this.selectedDay || !settings.displayNotesCreatedOnDate) {
            return;
        }

        const notes = await this.noteRepository.getNotesCreatedOn(this.selectedDay);
        this.refreshNotesEvent.emitEvent(notes);
    }

    private async deleteNote(note: Note): Promise<void> {
        await this.fileService.tryDeleteFile(note.path);
        await this.refreshNotes();
    }

    private async refreshNotesCreatedOn(date: Day): Promise<void> {
        this.selectedDay = date;
        await this.refreshNotes();
    }
}