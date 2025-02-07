import { DayNoteRepository } from './day.note-repository';
import { NoteAdapter } from 'src-old/domain/adapters/note.adapter';
import { SettingsRepository } from 'src-old/domain/repositories/settings.repository';
import { Logger } from 'src-old/domain/loggers/logger';
import { Day } from 'src-old/domain/models/day';
import { Note } from 'src-old/domain/models/note';
import { NotesSettings } from 'src-old/domain/models/settings/notes.settings';
import { DateParser } from 'src-old/domain/parsers/date.parser';

describe('DayNoteRepository', () => {
    let mockNoteAdapter: NoteAdapter;
    let mockSettingsRepository: SettingsRepository<NotesSettings>;
    let mockLogger: Logger;
    let mockDateParser: DateParser;
    let repository: DayNoteRepository;

    beforeEach(() => {
        mockNoteAdapter = {
            getNotes: jest.fn()
        } as unknown as NoteAdapter;
        mockSettingsRepository = {
            getSettings: jest.fn()
        } as unknown as SettingsRepository<NotesSettings>;
        mockLogger = {
            logAndThrow: jest.fn((message: string) => {
                throw new Error(message);
            })
        } as unknown as Logger;
        mockDateParser = {
            parseString: jest.fn()
        } as unknown as DateParser;
        repository = new DayNoteRepository(mockSettingsRepository, mockNoteAdapter, mockDateParser, mockLogger);
    });

    it('should call getNotes with the correct filter when useCreatedOnDateFromProperties is false', async () => {
        const day: Day = { dayOfWeek: 1, date: new Date(2023, 9, 2), name: '2' };
        const notes: Note[] = [
            { name: 'Note 1', createdOn: new Date(2023, 9, 2, 10), path: 'path/to/note1', properties: new Map() },
            { name: 'Note 2', createdOn: new Date(2023, 9, 2, 11), path: 'path/to/note2', properties: new Map() },
        ];

        (mockSettingsRepository.getSettings as jest.Mock).mockResolvedValueOnce({
            useCreatedOnDateFromProperties: false
        } as NotesSettings);
        (mockNoteAdapter.getNotes as jest.Mock).mockImplementationOnce((filter) => notes.filter(filter));

        const result = await repository.getNotesCreatedOn(day);

        expect(mockNoteAdapter.getNotes).toHaveBeenCalledWith(expect.any(Function));
        expect(result).toEqual(notes);
    });

    it('should call getNotes with the correct filter when useCreatedOnDateFromProperties is true', async () => {
        const day: Day = { dayOfWeek: 1, date: new Date(2023, 9, 2), name: '2' };
        const notes: Note[] = [
            { name: 'Note 1', createdOn: new Date(2023, 9, 2, 10), path: 'path/to/note1', properties: new Map([['createdOn', '2023-10-02']]) },
            { name: 'Note 2', createdOn: new Date(2023, 9, 2, 11), path: 'path/to/note2', properties: new Map([['createdOn', '2023-10-02']]) },
        ];

        (mockSettingsRepository.getSettings as jest.Mock).mockResolvedValueOnce({
            useCreatedOnDateFromProperties: true,
            createdOnDatePropertyName: 'createdOn',
            createdOnPropertyFormat: 'yyyy-MM-dd'
        } as NotesSettings);
        (mockDateParser.parseString as jest.Mock).mockReturnValue(new Date(2023, 9, 2));
        (mockNoteAdapter.getNotes as jest.Mock).mockImplementationOnce((filter) => notes.filter(filter));

        const result = await repository.getNotesCreatedOn(day);

        expect(mockNoteAdapter.getNotes).toHaveBeenCalledWith(expect.any(Function));
        expect(result).toEqual(notes);
    });

    it('should log and throw an error when useCreatedOnDateFromProperties is true and createdOnDatePropertyName is not set', async () => {
        const day: Day = { dayOfWeek: 1, date: new Date(2023, 9, 2), name: '2' };

        (mockSettingsRepository.getSettings as jest.Mock).mockResolvedValueOnce({
            useCreatedOnDateFromProperties: true,
            createdOnDatePropertyName: ''
        } as NotesSettings);

        await expect(repository.getNotesCreatedOn(day)).rejects.toThrow();
        expect(mockLogger.logAndThrow).toHaveBeenCalledWith('Created on date property name is not set');
    });

    it('should return an empty array when no notes are found', async () => {
        const day: Day = { dayOfWeek: 1, date: new Date(2023, 9, 2), name: '2' };

        (mockSettingsRepository.getSettings as jest.Mock).mockResolvedValueOnce({
            useCreatedOnDateFromProperties: false
        } as NotesSettings);
        (mockNoteAdapter.getNotes as jest.Mock).mockImplementationOnce((filter) => []);

        const result = await repository.getNotesCreatedOn(day);

        expect(mockNoteAdapter.getNotes).toHaveBeenCalledWith(expect.any(Function));
        expect(result).toEqual([]);
    });
});