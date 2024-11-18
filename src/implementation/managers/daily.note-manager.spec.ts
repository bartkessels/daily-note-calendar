import {DailyNoteManager} from './daily.note-manager';
import {Event} from 'src/domain/events/event';
import {Day, DayOfWeek} from 'src/domain/models/day';
import {SettingsRepository} from 'src/domain/repositories/settings.repository';
import {NameBuilder} from 'src/domain/builders/name.builder';
import {FileService} from 'src/domain/services/file.service';
import {jest} from '@jest/globals';
import {DailyNoteEvent} from 'src/implementation/events/daily-note.event';
import {DailyNotesPeriodicNoteSettings} from 'src/domain/models/settings/daily-notes.periodic-note-settings';

describe('DailyNoteManager', () => {
    let event: Event<Day>;
    let settingsRepository: jest.Mocked<SettingsRepository<DailyNotesPeriodicNoteSettings>>;
    let fileNameBuilder: jest.Mocked<NameBuilder<Day>>;
    let fileService: jest.Mocked<FileService>;
    let day: Day;
    let manager: DailyNoteManager;

    beforeEach(() => {
        event = new DailyNoteEvent();
        settingsRepository = {
            getSettings: jest.fn(),
            storeSettings: jest.fn(),
        } as jest.Mocked<SettingsRepository<DailyNotesPeriodicNoteSettings>>;
        fileNameBuilder = {
            withNameTemplate: jest.fn().mockReturnThis(),
            withValue: jest.fn().mockReturnThis(),
            withPath: jest.fn().mockReturnThis(),
            build: jest.fn(),
        } as jest.Mocked<NameBuilder<Day>>;
        fileService = {
            tryOpenFile: jest.fn(),
        } as jest.Mocked<FileService>;
        day = {
            dayOfWeek: DayOfWeek.Tuesday,
            date: 12,
            name: '12',
            completeDate: new Date('2024-11-12')
        };

        manager = new DailyNoteManager(event, settingsRepository, fileNameBuilder, fileService);
    });

    it('should open a note based on the day and settings', async () => {
        const filePath = 'folder/12-11-2024.md';
        const settings: DailyNotesPeriodicNoteSettings = {
            nameTemplate: 'dd-MM-yyyy',
            folder: 'folder',
            templateFile: 'templateFile',
        };

        settingsRepository.getSettings.mockResolvedValueOnce(settings);
        fileNameBuilder.build.mockReturnValueOnce(filePath);

        await manager.tryOpenNote(day);

        expect(settingsRepository.getSettings).toHaveBeenCalled();
        expect(fileService.tryOpenFile).toHaveBeenCalledWith(filePath, settings.templateFile);
    });

    it('should try to open a note when an event is triggered', async () => {
        const filePath = 'folder/12-11-2024.md';
        const settings: DailyNotesPeriodicNoteSettings = {
            nameTemplate: 'dd-MM-yyyy',
            folder: 'folder',
            templateFile: 'templateFile',
        };

        settingsRepository.getSettings.mockResolvedValueOnce(settings);
        fileNameBuilder.build.mockReturnValueOnce(filePath);

        const tryOpenNoteSpy = jest.spyOn(manager, 'tryOpenNote');
        event.emitEvent(day);

        expect(tryOpenNoteSpy).toHaveBeenCalledWith(day);
    });
});