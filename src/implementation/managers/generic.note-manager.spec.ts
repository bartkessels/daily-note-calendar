import { GenericNotesManager } from './generic.notes-manager';
import { Note } from 'src/domain/models/note';
import { Day } from 'src/domain/models/day';
import { Event } from 'src/domain/events/event';
import { FileService } from 'src/domain/services/file.service';
import { NoteRepository } from 'src/domain/repositories/note.repository';
import { jest } from '@jest/globals';
import {NoteEvent} from 'src/implementation/events/note.event';

describe('GenericNotesManager', () => {
    let event: Event<Note>;
    let fileService: jest.Mocked<FileService>;
    let noteRepository: jest.Mocked<NoteRepository<Day>>;
    let manager: GenericNotesManager;
    let note: Note;
    let day: Day;

    beforeEach(() => {
        event = new NoteEvent();
        fileService = {
            tryOpenFileWithTemplate: jest.fn(),
            tryOpenFile: jest.fn()
        } as jest.Mocked<FileService>;
        noteRepository = {
            getNotesCreatedOn: jest.fn(),
        } as jest.Mocked<NoteRepository<Day>>;
        manager = new GenericNotesManager(event, fileService, noteRepository);
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

    it('should return notes created on a specific day', async () => {
        const notes: Note[] = [
            { name: 'Note 1', createdOn: new Date('2024-11-12'), path: 'path/to/note1' },
            { name: 'Note 2', createdOn: new Date('2024-11-12'), path: 'path/to/note2' },
        ];

        noteRepository.getNotesCreatedOn.mockResolvedValueOnce(notes);

        const result = await manager.getNotesCreatedOn(day);

        expect(noteRepository.getNotesCreatedOn).toHaveBeenCalledWith(day);
        expect(result).toEqual(notes);
    });

    it('should return an empty array when no notes are found for a specific day', async () => {
        noteRepository.getNotesCreatedOn.mockResolvedValueOnce([]);

        const result = await manager.getNotesCreatedOn(day);

        expect(noteRepository.getNotesCreatedOn).toHaveBeenCalledWith(day);
        expect(result).toEqual([]);
    });
});