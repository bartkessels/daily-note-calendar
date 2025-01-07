import { GenericNotesManager } from './generic.notes-manager';
import { Note } from 'src/domain/models/note';
import { Day } from 'src/domain/models/day';
import { Event } from 'src/domain/events/event';
import { FileService } from 'src/domain/services/file.service';
import { NoteRepository } from 'src/domain/repositories/note.repository';
import { SettingsRepository } from 'src/domain/repositories/settings.repository';
import {DEFAULT_GENERAL_SETTINGS, GeneralSettings} from 'src/domain/models/settings/general.settings';
import { jest } from '@jest/globals';
import {RefreshNotesEvent} from 'src/implementation/events/refresh-notes.event';
import {ManageAction} from 'src/domain/events/manage.event';
import {PeriodicManageEvent} from 'src/implementation/events/periodic.manage-event';
import {NoteManageEvent} from 'src/implementation/events/note.manage-event';

describe('GenericNotesManager', () => {
    let manageNoteEvent = new NoteManageEvent();
    let manageDayEvent = new PeriodicManageEvent<Day>();
    let refreshNotesEvent: Event<Note[]>;
    let fileService: jest.Mocked<FileService>;
    let noteRepository: jest.Mocked<NoteRepository<Day>>;
    let settingsRepository: jest.Mocked<SettingsRepository<GeneralSettings>>;
    let manager: GenericNotesManager;
    let note: Note;
    let day: Day;

    beforeEach(() => {
        manageDayEvent = new PeriodicManageEvent<Day>();
        refreshNotesEvent = new RefreshNotesEvent();
        fileService = {
            doesFileExist: jest.fn(),
            createFileWithTemplate: jest.fn(),
            tryOpenFile: jest.fn(),
            tryDeleteFile: jest.fn()
        } as jest.Mocked<FileService>;
        noteRepository = {
            getNotesCreatedOn: jest.fn(),
        } as jest.Mocked<NoteRepository<Day>>;
        settingsRepository = {
            storeSettings: jest.fn(),
            getSettings: jest.fn(),
        } as jest.Mocked<SettingsRepository<GeneralSettings>>;
        manager = new GenericNotesManager(
            manageNoteEvent,
            manageDayEvent,
            refreshNotesEvent,
            fileService,
            noteRepository,
            settingsRepository
        );
        note = {
            createdOn: new Date('2024-11-12'),
            name: 'My first note',
            path: 'Journaling/2024/My first note.md',
            properties: new Map(),
        };
        day = {
            dayOfWeek: 2,
            date: new Date('2024-11-12'),
            name: '12',
        };

        const settings: GeneralSettings = {
            ...DEFAULT_GENERAL_SETTINGS,
            displayNotesCreatedOnDate: true
        };
        settingsRepository.getSettings.mockResolvedValue(settings);
    });

    it('should open a note based on the note path', async () => {
        await manager.tryOpenNote(note);

        expect(fileService.tryOpenFile).toHaveBeenCalledWith(note.path);
    });

    it('should try to open a note when a note event is emitted', async () => {
        manageNoteEvent.emitEvent(ManageAction.Open, note);

        expect(fileService.tryOpenFile).toHaveBeenCalledWith(note.path);
        expect(fileService.tryDeleteFile).not.toHaveBeenCalled();
    });

    it('should try to delete a note when a delete note event is emitted', async () => {
        const openNoteEventSpy = jest.spyOn(manager, 'tryOpenNote');
        manageNoteEvent.emitEvent(ManageAction.Delete, note);

        expect(fileService.tryDeleteFile).toHaveBeenCalledWith(note.path);
        expect(openNoteEventSpy).not.toHaveBeenCalled();
    });

    it('should call the refresh notes event with the notes when an open day event has been sent', async () => {
        const refreshNotesEventSpy = jest.spyOn(manager, 'refreshNotes');
        manageDayEvent.emitEvent(ManageAction.Open, day);

        expect(refreshNotesEventSpy).toHaveBeenCalled();
    });

    it('should call the refresh notes event with the notes when a preview day event has been sent', async () => {
        const refreshNotesEventSpy = jest.spyOn(manager, 'refreshNotes');
        manageDayEvent.emitEvent(ManageAction.Preview, day);

        expect(refreshNotesEventSpy).toHaveBeenCalled();
    });

    it('should call the refresh notes event with a specific day if displayNotesCreatedOnDate is true and a date has been selected previously', async () => {
        const refreshNotesEventSpy = jest.spyOn(refreshNotesEvent, 'emitEvent');
        const notes: Note[] = [
            { name: 'Note 1', createdOn: new Date('2024-11-12'), path: 'path/to/note1', properties: new Map() },
            { name: 'Note 2', createdOn: new Date('2024-11-12'), path: 'path/to/note2', properties: new Map() },
        ];
        noteRepository.getNotesCreatedOn.mockResolvedValue(notes);

        manageDayEvent.emitEvent(ManageAction.Open, day);
        await manager.refreshNotes();

        expect(settingsRepository.getSettings).toHaveBeenCalled();
        expect(noteRepository.getNotesCreatedOn).toHaveBeenCalledWith(day);
        expect(refreshNotesEventSpy).toHaveBeenCalledWith(notes);
    });

    it('should not emit an refreshNotes event when the setting displayNotesCreatedOnDate is true but no day has been selected yet', async () => {
        const refreshNotesEventSpy = jest.spyOn(refreshNotesEvent, 'emitEvent');

        await manager.refreshNotes();

        expect(settingsRepository.getSettings).toHaveBeenCalled();
        expect(noteRepository.getNotesCreatedOn).not.toHaveBeenCalled();
        expect(refreshNotesEventSpy).not.toHaveBeenCalled();
    });

    it('should not emit an refreshNotes event when the setting displayNotesCreatedOnDate is false', async () => {
        const refreshNotesEventSpy = jest.spyOn(refreshNotesEvent, 'emitEvent');
        const settings: GeneralSettings = {
            ...DEFAULT_GENERAL_SETTINGS,
            displayNotesCreatedOnDate: false
        };

        settingsRepository.getSettings.mockResolvedValueOnce(settings);

        await manager.refreshNotes();

        expect(settingsRepository.getSettings).toHaveBeenCalled();
        expect(noteRepository.getNotesCreatedOn).not.toHaveBeenCalled();
        expect(refreshNotesEventSpy).not.toHaveBeenCalled();
    });
});