import {WeeklyNoteManager} from './weekly.note-manager';
import {Event} from 'src/domain/events/event';
import {Week} from 'src/domain/models/week';
import {SettingsRepository} from 'src/domain/repositories/settings.repository';
import {NameBuilder} from 'src/domain/builders/name.builder';
import {FileService} from 'src/domain/services/file.service';
import {jest} from '@jest/globals';
import {WeeklyNoteEvent} from 'src/implementation/events/weekly-note.event';
import {Day, DayOfWeek} from 'src/domain/models/day';
import {WeeklyNotesPeriodicNoteSettings} from 'src/domain/models/settings/weekly-notes.periodic-note-settings';

describe('WeeklyNoteManager', () => {
    let event: Event<Week>;
    let settingsRepository: jest.Mocked<SettingsRepository<WeeklyNotesPeriodicNoteSettings>>;
    let fileNameBuilder: jest.Mocked<NameBuilder<Week>>;
    let fileService: jest.Mocked<FileService>;
    let week: Week;
    let manager: WeeklyNoteManager;

    beforeEach(() => {
        event = new WeeklyNoteEvent();
        settingsRepository = {
            getSettings: jest.fn(),
            storeSettings: jest.fn(),
        } as jest.Mocked<SettingsRepository<WeeklyNotesPeriodicNoteSettings>>;
        fileNameBuilder = {
            withNameTemplate: jest.fn().mockReturnThis(),
            withValue: jest.fn().mockReturnThis(),
            withPath: jest.fn().mockReturnThis(),
            build: jest.fn(),
        } as jest.Mocked<NameBuilder<Week>>;
        fileService = {
            tryOpenFileWithTemplate: jest.fn(),
            tryOpenFile: jest.fn()
        } as jest.Mocked<FileService>;
        week = {
            weekNumber: 46,
            days: [<Day>{
                dayOfWeek: DayOfWeek.Tuesday,
                date: 12,
                name: '12',
                completeDate: new Date('2024-11-12')
            }]
        };

        manager = new WeeklyNoteManager(event, settingsRepository, fileNameBuilder, fileService);
    });

    it('should open a note based on the week and settings', async () => {
        const filePath = 'folder/Week-46-2024.md';
        const settings: WeeklyNotesPeriodicNoteSettings = {
            nameTemplate: 'Week-ww-yyyy',
            folder: 'folder',
            templateFile: 'templateFile',
        };

        settingsRepository.getSettings.mockResolvedValueOnce(settings);
        fileNameBuilder.build.mockReturnValueOnce(filePath);

        await manager.tryOpenNote(week);

        expect(settingsRepository.getSettings).toHaveBeenCalled();
        expect(fileService.tryOpenFileWithTemplate).toHaveBeenCalledWith(filePath, settings.templateFile);
    });

    it('should call tryOpenNote when an event is emitted', async () => {
        const filePath = 'folder/Week-46-2024.md';
        const settings: WeeklyNotesPeriodicNoteSettings = {
            nameTemplate: 'Week-ww-yyyy',
            folder: 'folder',
            templateFile: 'templateFile',
        };

        settingsRepository.getSettings.mockResolvedValueOnce(settings);
        fileNameBuilder.build.mockReturnValueOnce(filePath);

        const tryOpenNoteSpy = jest.spyOn(manager, 'tryOpenNote');
        event.emitEvent(week);

        expect(tryOpenNoteSpy).toHaveBeenCalledWith(week);
    });
});