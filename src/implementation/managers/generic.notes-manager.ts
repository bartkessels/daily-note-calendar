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
        private readonly refreshNotesEvent: Event<Note[]>,
        private readonly fileService: FileService,
        private readonly noteRepository: NoteRepository<Day>,
        private readonly settingsRepository: SettingsRepository<GeneralSettings>
    ) {
        dailyNoteEvent.onEvent(GenericNotesManager, (day) => this.refreshNotesCreatedOnDay(day));
        noteEvent.onEvent(GenericNotesManager, (note) => this.tryOpenNote(note));
    }

    public async tryOpenNote(note: Note) : Promise<void> {
        return this.fileService.tryOpenFile(note.path);
    }

    public async refreshNotes(): Promise<void> {
        console.log('Refreshing notes, current day is', this.selectedDay);
        if (!this.selectedDay) {
            return;
        }

        const settings = await this.settingsRepository.getSettings();
        if (!settings.displayNotesCreatedOnDate) {
            return;
        }

        const notes = await this.noteRepository.getNotesCreatedOn(this.selectedDay);
        this.refreshNotesEvent.emitEvent(notes);
    }

    private refreshNotesCreatedOnDay(day: Day): Promise<void> {
        console.log('Refreshing notes for day', day);

        this.selectedDay = day;
        console.log(this.selectedDay);
        return this.refreshNotes();
    }
}