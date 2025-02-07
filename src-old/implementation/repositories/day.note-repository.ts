import {Day} from 'src-old/domain/models/day';
import {NoteRepository} from 'src-old/domain/repositories/note.repository';
import {Note} from 'src-old/domain/models/note';
import {NoteAdapter} from 'src-old/domain/adapters/note.adapter';
import {SettingsRepository} from 'src-old/domain/repositories/settings.repository';
import {NotesSettings} from 'src-old/domain/models/settings/notes.settings';
import {Logger} from 'src-old/domain/loggers/logger';
import {DateParser} from 'src-old/domain/parsers/date.parser';

export class DayNoteRepository implements NoteRepository<Day> {
    constructor(
        private readonly settingsRepository: SettingsRepository<NotesSettings>,
        private readonly noteRepository: NoteAdapter,
        private readonly dateParser: DateParser,
        private readonly logger: Logger
    ) {

    }

    public async getNotesCreatedOn(date: Day): Promise<Note[]> {
        const settings = await this.settingsRepository.getSettings();
        let filter = (note: Note): boolean => {
            return note.createdOn?.toLocaleDateString() === date.date.toLocaleDateString();
        };

        if (settings.useCreatedOnDateFromProperties && !settings.createdOnDatePropertyName) {
            this.logger.logAndThrow('Created on date property name is not set');
        }

        if (settings.useCreatedOnDateFromProperties) {
            filter = (note: Note): boolean => {
                const dateProperty = note.properties?.get(settings.createdOnDatePropertyName) ?? '';
                const noteDate = this.dateParser.parseString(dateProperty, settings.createdOnPropertyFormat);

                return noteDate?.toLocaleDateString() === date.date.toLocaleDateString();
            };
        }

        return await this.noteRepository.getNotes(filter);
    }
}