import { DayNoteRepository } from './day.note-repository';
import { NoteAdapter } from 'src/domain/adapters/note.adapter';
import { SettingsRepository } from 'src/domain/repositories/settings.repository';
import { Logger } from 'src/domain/loggers/logger';
import { Day } from 'src/domain/models/day';
import { Note } from 'src/domain/models/note';
import { NotesSettings } from 'src/domain/models/settings/notes.settings';

describe('DayNoteRepository', () => {
    let mockNoteAdapter: NoteAdapter;
    let mockSettingsRepository: SettingsRepository<NotesSettings>;
    let mockLogger: Logger;
    let repository: DayNoteRepository;

    beforeEach(() => {
        mockNoteAdapter = {
            getNotesCreatedOn: jest.fn(),
            getNotesWithCreatedOnProperty: jest.fn()
        } as unknown as NoteAdapter;
        mockSettingsRepository = {
            getSettings: jest.fn()
        } as unknown as SettingsRepository<NotesSettings>;
        mockLogger = {
            logAndThrow: jest.fn((message: string) => {
                throw new Error(message);
            })
        } as unknown as Logger;
        repository = new DayNoteRepository(mockSettingsRepository, mockNoteAdapter, mockLogger);
    });

    it('should call getNotesCreatedOn on the note adapter when useCreatedOnDateFromProperties is false', async () => {
        const day: Day = { dayOfWeek: 1, date: new Date(2023, 9, 2), name: '2' };
        const notes: Note[] = [
            { name: 'Note 1', createdOn: new Date(2023, 9, 2, 10), path: 'path/to/note1' },
            { name: 'Note 2', createdOn: new Date(2023, 9, 2, 11), path: 'path/to/note2' },
        ];

        (mockSettingsRepository.getSettings as jest.Mock).mockResolvedValueOnce({
            useCreatedOnDateFromProperties: false
        } as NotesSettings);
        (mockNoteAdapter.getNotesCreatedOn as jest.Mock).mockResolvedValueOnce(notes);

        const result = await repository.getNotesCreatedOn(day);

        expect(mockNoteAdapter.getNotesCreatedOn).toHaveBeenCalledWith(day.date);
        expect(result).toEqual(notes);
    });

    it('should call getNotesWithCreatedOnProperty on the note adapter when useCreatedOnDateFromProperties is true', async () => {
        const day: Day = { dayOfWeek: 1, date: new Date(2023, 9, 2), name: '2' };
        const notes: Note[] = [
            { name: 'Note 1', createdOn: new Date(2023, 9, 2, 10), path: 'path/to/note1' },
            { name: 'Note 2', createdOn: new Date(2023, 9, 2, 11), path: 'path/to/note2' },
        ];

        (mockSettingsRepository.getSettings as jest.Mock).mockResolvedValueOnce({
            useCreatedOnDateFromProperties: true,
            createdOnDatePropertyName: 'createdOn'
        } as NotesSettings);
        (mockNoteAdapter.getNotesWithCreatedOnProperty as jest.Mock).mockResolvedValueOnce(notes);

        const result = await repository.getNotesCreatedOn(day);

        expect(mockNoteAdapter.getNotesWithCreatedOnProperty).toHaveBeenCalledWith(day.date, 'createdOn');
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
        (mockNoteAdapter.getNotesCreatedOn as jest.Mock).mockResolvedValueOnce([]);

        const result = await repository.getNotesCreatedOn(day);

        expect(mockNoteAdapter.getNotesCreatedOn).toHaveBeenCalledWith(day.date);
        expect(result).toEqual([]);
    });
});