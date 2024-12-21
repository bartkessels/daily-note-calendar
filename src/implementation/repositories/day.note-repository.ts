import {Day} from 'src/domain/models/day';
import {NoteRepository} from 'src/domain/repositories/note.repository';
import {Note} from 'src/domain/models/note';
import {NoteAdapter} from 'src/domain/adapters/note.adapter';
import {SettingsRepository} from 'src/domain/repositories/settings.repository';
import {NotesSettings} from 'src/domain/models/settings/notes.settings';
import {Logger} from 'src/domain/loggers/logger';

export class DayNoteRepository implements NoteRepository<Day> {
    constructor(
        private readonly settingsRepository: SettingsRepository<NotesSettings>,
        private readonly noteRepository: NoteAdapter,
        private readonly logger: Logger
    ) {

    }

    public async getNotesCreatedOn(date: Day): Promise<Note[]> {
        const settings = await this.settingsRepository.getSettings();

        if (settings.useCreatedOnDateFromProperties && !settings.createdOnDatePropertyName) {
            this.logger.logAndThrow('Created on date property name is not set');
        } else if (settings.useCreatedOnDateFromProperties) {
            return await this.noteRepository.getNotesWithCreatedOnProperty(date.date, settings.createdOnDatePropertyName);
        }

        return await this.noteRepository.getNotesCreatedOn(date.date);
    }
}