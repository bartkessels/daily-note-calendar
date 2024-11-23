import { PeriodicNoteManager } from './periodic.note-manager';
import { Event } from 'src/domain/events/event';
import { FileService } from 'src/domain/services/file.service';
import { NameBuilder } from 'src/domain/builders/name.builder';
import { SettingsRepository } from 'src/domain/repositories/settings.repository';
import { PeriodicNoteSettings } from 'src/domain/models/settings/periodic-note.settings';
import { jest } from '@jest/globals';
import {Day, DayOfWeek} from 'src/domain/models/day';
import {PeriodicNoteEvent} from 'src/implementation/events/periodic-note.event';

describe('PeriodicNoteManager', () => {
    let event: Event<Day>;
    let settingsRepository: jest.Mocked<SettingsRepository<PeriodicNoteSettings>>;
    let fileNameBuilder: jest.Mocked<NameBuilder<Day>>;
    let fileService: jest.Mocked<FileService>;
    let manager: PeriodicNoteManager<Day, PeriodicNoteSettings>;
    let value: Day;
    let settings: PeriodicNoteSettings;

    beforeEach(() => {
        event = new PeriodicNoteEvent<Day>();
        settingsRepository = {
            getSettings: jest.fn(),
            storeSettings: jest.fn()
        } as jest.Mocked<SettingsRepository<PeriodicNoteSettings>>;
        fileNameBuilder = {
            withNameTemplate: jest.fn().mockReturnThis(),
            withValue: jest.fn().mockReturnThis(),
            withPath: jest.fn().mockReturnThis(),
            build: jest.fn()
        } as jest.Mocked<NameBuilder<Day>>;
        fileService = {
            tryOpenFileWithTemplate: jest.fn(),
            tryOpenFile: jest.fn()
        } as jest.Mocked<FileService>;

        manager = new PeriodicNoteManager(event, settingsRepository, fileNameBuilder, fileService);
        value = {
            dayOfWeek: DayOfWeek.Tuesday,
            date: 12,
            name: '12',
            completeDate: new Date('2024-11-12')
        };
        settings = {
            nameTemplate: 'template',
            folder: 'folder',
            templateFile: 'templateFile'
        };

        settingsRepository.getSettings.mockResolvedValueOnce(settings);
    });

    it('should try to open a note with the correct file path and template', async () => {
        fileNameBuilder.build.mockReturnValueOnce('filePath');

        await manager.tryOpenNote(value);

        expect(settingsRepository.getSettings).toHaveBeenCalled();
        expect(fileNameBuilder.withNameTemplate).toHaveBeenCalledWith(settings.nameTemplate);
        expect(fileNameBuilder.withValue).toHaveBeenCalledWith(value);
        expect(fileNameBuilder.withPath).toHaveBeenCalledWith(settings.folder);
        expect(fileNameBuilder.build).toHaveBeenCalled();
        expect(fileService.tryOpenFileWithTemplate).toHaveBeenCalledWith('filePath', settings.templateFile);
    });

    it('should handle event and try to open note', async () => {
        const tryOpenNoteSpy = jest.spyOn(manager, 'tryOpenNote');
        event.emitEvent(value);

        expect(tryOpenNoteSpy).toHaveBeenCalledWith(value);
    });
});