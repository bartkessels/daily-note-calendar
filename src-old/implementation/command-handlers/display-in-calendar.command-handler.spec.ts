import { DisplayInCalendarCommandHandler } from 'src-old/implementation/command-handlers/display-in-calendar.command-handler';
import { NoteAdapter } from 'src-old/domain/adapters/note.adapter';
import { DateRepository } from 'src-old/domain/repositories/date.repository';
import { ManageEvent } from 'src-old/domain/events/manage.event';
import {Day, DayOfWeek} from 'src-old/domain/models/day';
import { SettingsRepository } from 'src-old/domain/repositories/settings.repository';
import { NotesSettings } from 'src-old/domain/models/settings/notes.settings';
import { DateParser } from 'src-old/domain/parsers/date.parser';
import { Note } from 'src-old/domain/models/note';
import { ManageAction } from 'src-old/domain/events/manage.event';

describe('DisplayInCalendarCommandHandler', () => {
    let handler: DisplayInCalendarCommandHandler;
    let settingsRepository: jest.Mocked<SettingsRepository<NotesSettings>>;
    let noteAdapter: jest.Mocked<NoteAdapter>;
    let dateRepository: jest.Mocked<DateRepository>;
    let manageDayEvent: jest.Mocked<ManageEvent<Day>>;
    let dateParser: jest.Mocked<DateParser>;

    beforeEach(() => {
        settingsRepository = {
            getSettings: jest.fn()
        } as unknown as jest.Mocked<SettingsRepository<NotesSettings>>;
        noteAdapter = {
            getActiveNote: jest.fn()
        } as unknown as jest.Mocked<NoteAdapter>;
        dateRepository = {
            getDay: jest.fn()
        } as unknown as jest.Mocked<DateRepository>;
        manageDayEvent = {
            emitEvent: jest.fn()
        } as unknown as jest.Mocked<ManageEvent<Day>>;
        dateParser = {
            parseString: jest.fn()
        } as unknown as jest.Mocked<DateParser>;

        handler = new DisplayInCalendarCommandHandler(
            settingsRepository,
            noteAdapter,
            dateRepository,
            manageDayEvent,
            dateParser
        );
    });

    it('should emit an event with the day from the createdOn property of the note', async () => {
        const note: Note = {
            name: 'My note',
            path: 'path/to/note',
            createdOn: new Date(2023, 9, 2),
            properties: new Map()
        };
        const day: Day = { name: '2', date: new Date(2023, 9, 2), dayOfWeek: DayOfWeek.Monday };
        settingsRepository.getSettings.mockResolvedValue({
            useCreatedOnDateFromProperties: false
        } as NotesSettings);
        noteAdapter.getActiveNote.mockResolvedValue(note);
        dateRepository.getDay.mockReturnValue(day);

        await handler.execute();

        expect(dateParser.parseString).not.toHaveBeenCalled();
        expect(dateRepository.getDay).toHaveBeenCalledWith(note.createdOn);
        expect(manageDayEvent.emitEvent).toHaveBeenCalledWith(ManageAction.Preview, day);
    });

    it('should emit an event with the day from the property if specified in the settings', async () => {
        const note: Note = {
            name: 'My note',
            path: 'path/to/note',
            createdOn: new Date(2023, 9, 2),
            properties: new Map([['createdOn', '2023-10-02']])
        };
        const day: Day = { name: '2', date: new Date(2023, 10, 2), dayOfWeek: DayOfWeek.Monday };
        settingsRepository.getSettings.mockResolvedValue({
            useCreatedOnDateFromProperties: true,
            createdOnDatePropertyName: 'createdOn',
            createdOnPropertyFormat: 'yyyy-MM-dd'
        } as NotesSettings);
        noteAdapter.getActiveNote.mockResolvedValue(note);
        dateParser.parseString.mockReturnValue(new Date(2023, 10, 2));
        dateRepository.getDay.mockReturnValue(day);

        await handler.execute();

        expect(dateParser.parseString).toHaveBeenCalledWith('2023-10-02', 'yyyy-MM-dd');
        expect(dateRepository.getDay).toHaveBeenCalledWith(new Date(2023, 10, 2));
        expect(manageDayEvent.emitEvent).toHaveBeenCalledWith(ManageAction.Preview, day);
    });

    it('should emit an event with the day from the createdOn value if the property is not set', async () => {
        const note: Note = {
            name: 'My note',
            path: 'path/to/note',
            createdOn: new Date(2023, 9, 2),
            properties: new Map()
        };
        const day: Day = { name: '2', date: new Date(2023, 9, 2), dayOfWeek: DayOfWeek.Monday };
        settingsRepository.getSettings.mockResolvedValue({
            useCreatedOnDateFromProperties: true,
            createdOnDatePropertyName: 'createdOn',
            createdOnPropertyFormat: 'yyyy-MM-dd'
        } as NotesSettings);
        noteAdapter.getActiveNote.mockResolvedValue(note);
        dateRepository.getDay.mockReturnValue(day);

        await handler.execute();

        expect(dateParser.parseString).not.toHaveBeenCalled();
        expect(dateRepository.getDay).toHaveBeenCalledWith(note.createdOn);
        expect(manageDayEvent.emitEvent).toHaveBeenCalledWith(ManageAction.Preview, day);
    });
});