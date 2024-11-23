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
import {DailyNoteEvent} from 'src/implementation/events/daily-note.event';
import {RefreshNotesEvent} from 'src/implementation/events/refresh-notes.event';

describe('GenericNotesManager', () => {
    let noteEvent: Event<Note>;
    let dailyNoteEvent: Event<Day>;
    let refreshNotesEvent: Event<Note[]>;
    let fileService: jest.Mocked<FileService>;
    let noteRepository: jest.Mocked<NoteRepository<Day>>;
    let settingsRepository: jest.Mocked<SettingsRepository<GeneralSettings>>;
    let manager: GenericNotesManager;
    let note: Note;
    let day: Day;

    beforeEach(() => {
        noteEvent = new NoteEvent();
        dailyNoteEvent = new DailyNoteEvent();
        refreshNotesEvent = new RefreshNotesEvent();
        fileService = {
            tryOpenFileWithTemplate: jest.fn(),
            tryOpenFile: jest.fn(),
        } as jest.Mocked<FileService>;
        noteRepository = {
            getNotesCreatedOn: jest.fn(),
        } as jest.Mocked<NoteRepository<Day>>;
        settingsRepository = {
            storeSettings: jest.fn(),
            getSettings: jest.fn(),
        } as jest.Mocked<SettingsRepository<GeneralSettings>>;
        manager = new GenericNotesManager(noteEvent, dailyNoteEvent, refreshNotesEvent, fileService, noteRepository, settingsRepository);
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

        noteEvent.emitEvent(note);

        expect(tryOpenNoteSpy).toHaveBeenCalledWith(note);
    });

    it('should call the refresh notes event with the notes created on a specific day when a day event has been sent', async () => {
        const refreshNotesEventSpy = jest.spyOn(manager, 'refreshNotes');
        const settings: GeneralSettings = {
            displayNotesCreatedOnDate: true
        };

        settingsRepository.getSettings.mockResolvedValue(settings);

        dailyNoteEvent.emitEvent(day);

        expect(refreshNotesEventSpy).toHaveBeenCalled();
    });

    it('should call the refresh notes event with a specific day if displayNotesCreatedOnDate is true and a date has been selected previously', async () => {
        const refreshNotesEventSpy = jest.spyOn(refreshNotesEvent, 'emitEvent');
        const notes: Note[] = [
            { name: 'Note 1', createdOn: new Date('2024-11-12'), path: 'path/to/note1' },
            { name: 'Note 2', createdOn: new Date('2024-11-12'), path: 'path/to/note2' },
        ];
        const settings: GeneralSettings = {
            displayNotesCreatedOnDate: true
        };

        settingsRepository.getSettings.mockResolvedValue(settings);
        noteRepository.getNotesCreatedOn.mockResolvedValue(notes);

        dailyNoteEvent.emitEvent(day);
        await manager.refreshNotes();

        expect(settingsRepository.getSettings).toHaveBeenCalled();
        expect(noteRepository.getNotesCreatedOn).toHaveBeenCalledWith(day);
        expect(refreshNotesEventSpy).toHaveBeenCalledWith(notes);
    });

    it('should not emit an refreshNotes event when the setting displayNotesCreatedOnDate is true but no day has been selected yet', async () => {
        const refreshNotesEventSpy = jest.spyOn(refreshNotesEvent, 'emitEvent');
        const settings: GeneralSettings = {
            displayNotesCreatedOnDate: true
        };

        settingsRepository.getSettings.mockResolvedValueOnce(settings);

        await manager.refreshNotes();

        expect(settingsRepository.getSettings).toHaveBeenCalled();
        expect(noteRepository.getNotesCreatedOn).not.toHaveBeenCalled();
        expect(refreshNotesEventSpy).not.toHaveBeenCalled();
    });

    it('should not emit an refreshNotes event when the setting displayNotesCreatedOnDate is false', async () => {
        const refreshNotesEventSpy = jest.spyOn(refreshNotesEvent, 'emitEvent');
        const settings: GeneralSettings = {
            displayNotesCreatedOnDate: false
        };

        settingsRepository.getSettings.mockResolvedValueOnce(settings);

        await manager.refreshNotes();

        expect(settingsRepository.getSettings).toHaveBeenCalled();
        expect(noteRepository.getNotesCreatedOn).not.toHaveBeenCalled();
        expect(refreshNotesEventSpy).not.toHaveBeenCalled();
    });
});