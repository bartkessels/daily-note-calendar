import { GenericNotesManager } from './generic.notes-manager';
import { Note } from 'src/domain/models/note';
import { Day } from 'src/domain/models/day';
import { Event } from 'src/domain/events/event';
import { FileService } from 'src/domain/services/file.service';
import { NoteRepository } from 'src/domain/repositories/note.repository';
import { SettingsRepository } from 'src/domain/repositories/settings.repository';
import { GeneralSettings } from 'src/domain/models/settings/general.settings';
import { jest } from '@jest/globals';
import { NoteEvent } from 'src/implementation/events/note.event';

describe('GenericNotesManager', () => {
    let event: Event<Note>;
    let fileService: jest.Mocked<FileService>;
    let noteRepository: jest.Mocked<NoteRepository<Day>>;
    let settingsRepository: jest.Mocked<SettingsRepository<GeneralSettings>>;
    let manager: GenericNotesManager;
    let note: Note;
    let day: Day;

    beforeEach(() => {
        event = new NoteEvent();
        fileService = {
            tryOpenFile: jest.fn(),
            tryOpenFileWithTemplate: jest.fn()
        } as jest.Mocked<FileService>;
        noteRepository = {
            getNotesCreatedOn: jest.fn(),
        } as jest.Mocked<NoteRepository<Day>>;
        settingsRepository = {
            getSettings: jest.fn(),
            storeSettings: jest.fn()
        } as jest.Mocked<SettingsRepository<GeneralSettings>>;
        manager = new GenericNotesManager(event, fileService, noteRepository, settingsRepository);
        note = {
            createdOn: new Date('2024-11-12'),
            name: 'My first note',
            path: 'Journaling/2024/My first note.md',
        };
        day = {
            dayOfWeek: 2,
            date: 12,
            completeDate: new Date('2024-11-12'),
            name: '12',
        };
    });

    it('should open a note based on the note path', async () => {
        await manager.tryOpenNote(note);

        expect(fileService.tryOpenFile).toHaveBeenCalledWith(note.path);
    });

    it('should try to open a note when an event is emitted', async () => {
        const tryOpenNoteSpy = jest.spyOn(manager, 'tryOpenNote');
        event.emitEvent(note);

        expect(tryOpenNoteSpy).toHaveBeenCalledWith(note);
    });

    it('should return notes created on a specific day if displayNotesCreatedOnDate is true', async () => {
        const notes: Note[] = [
            { name: 'Note 1', createdOn: new Date('2024-11-12'), path: 'path/to/note1' },
            { name: 'Note 2', createdOn: new Date('2024-11-12'), path: 'path/to/note2' },
        ];
        const settings: GeneralSettings = {
            displayNotesCreatedOnDate: true,
        };

        settingsRepository.getSettings.mockResolvedValueOnce(settings);
        noteRepository.getNotesCreatedOn.mockResolvedValueOnce(notes);

        const result = await manager.getNotesCreatedOn(day);

        expect(settingsRepository.getSettings).toHaveBeenCalled();
        expect(noteRepository.getNotesCreatedOn).toHaveBeenCalledWith(day);
        expect(result).toEqual(notes);
    });

    it('should return an empty array if displayNotesCreatedOnDate is false', async () => {
        const settings: GeneralSettings = {
            displayNotesCreatedOnDate: false,
        };

        settingsRepository.getSettings.mockResolvedValueOnce(settings);

        const result = await manager.getNotesCreatedOn(day);

        expect(settingsRepository.getSettings).toHaveBeenCalled();
        expect(noteRepository.getNotesCreatedOn).not.toHaveBeenCalled();
        expect(result).toEqual([]);
    });
});