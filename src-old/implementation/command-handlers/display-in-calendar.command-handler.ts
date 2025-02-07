import {CommandHandler} from 'src-old/domain/command-handlers/command-handler';
import {NoteAdapter} from 'src-old/domain/adapters/note.adapter';
import { DateRepository } from 'src-old/domain/repositories/date.repository';
import {ManageAction, ManageEvent} from 'src-old/domain/events/manage.event';
import { Day } from 'src-old/domain/models/day';
import {SettingsRepository} from 'src-old/domain/repositories/settings.repository';
import {NotesSettings} from 'src-old/domain/models/settings/notes.settings';
import {DateParser} from 'src-old/domain/parsers/date.parser';
import {Note} from 'src-old/domain/models/note';

export class DisplayInCalendarCommandHandler implements CommandHandler {
    constructor(
        private readonly settingsRepository: SettingsRepository<NotesSettings>,
        private readonly noteAdapter: NoteAdapter,
        private readonly dateRepository: DateRepository,
        private readonly manageDayEvent: ManageEvent<Day>,
        private readonly dateParser: DateParser
    ) {

    }

    public async execute(): Promise<void> {
        const activeNote = await this.noteAdapter.getActiveNote();
        const activeDay = await this.getDayFromNote(activeNote);
        this.manageDayEvent.emitEvent(ManageAction.Preview, activeDay);
    }

    private async getDayFromNote(note: Note | null): Promise<Day | undefined> {
        if (!note) {
            return;
        }

        const settings = await this.settingsRepository.getSettings();
        const date = await this.getDateFromNote(note, settings);
        return this.dateRepository.getDay(date);
    }

    private async getDateFromNote(note: Note, settings: NotesSettings): Promise<Date> {
        const property = note.properties?.get(settings.createdOnDatePropertyName);
        let date: Date | null = null;

        if (settings.useCreatedOnDateFromProperties && property) {
            date = this.dateParser.parseString(property, settings.createdOnPropertyFormat);
        }

        return date ?? note.createdOn;
    }
}