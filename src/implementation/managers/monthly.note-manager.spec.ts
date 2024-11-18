import {MonthlyNoteManager} from './monthly.note-manager';
import {Event} from 'src/domain/events/event';
import {Month} from 'src/domain/models/month';
import {SettingsRepository} from 'src/domain/repositories/settings.repository';
import {NameBuilder} from 'src/domain/builders/name.builder';
import {FileService} from 'src/domain/services/file.service';
import {jest} from '@jest/globals';
import {MonthlyNoteEvent} from 'src/implementation/events/monthly-note.event';
import {Week} from 'src/domain/models/week';
import {Day, DayOfWeek} from 'src/domain/models/day';
import {MonthlyNotesPeriodicNoteSettings} from 'src/domain/models/settings/monthly-notes.periodic-note-settings';

describe('MonthlyNoteManager', () => {
    let event: Event<Month>;
    let settingsRepository: jest.Mocked<SettingsRepository<MonthlyNotesPeriodicNoteSettings>>;
    let fileNameBuilder: jest.Mocked<NameBuilder<Month>>;
    let fileService: jest.Mocked<FileService>;
    let month: Month;
    let manager: MonthlyNoteManager;

    beforeEach(() => {
        event = new MonthlyNoteEvent();
        settingsRepository = {
            getSettings: jest.fn(),
            storeSettings: jest.fn(),
        } as jest.Mocked<SettingsRepository<MonthlyNotesPeriodicNoteSettings>>;
        fileNameBuilder = {
            withNameTemplate: jest.fn().mockReturnThis(),
            withValue: jest.fn().mockReturnThis(),
            withPath: jest.fn().mockReturnThis(),
            build: jest.fn(),
        } as jest.Mocked<NameBuilder<Month>>;
        fileService = {
            tryOpenFileWithTemplate: jest.fn(),
            tryOpenFile: jest.fn()
        } as jest.Mocked<FileService>;
        month = {
            monthIndex: 11,
            quarter: 4,
            year: 2024,
            name: 'November',
            number: 12,
            weeks: [<Week> {
                weekNumber: 46,
                days: [<Day> {
                    dayOfWeek: DayOfWeek.Tuesday,
                    date: 12,
                    name: '12',
                    completeDate: new Date('2024-11-12')
                }]
            }]
        };

        manager = new MonthlyNoteManager(event, settingsRepository, fileNameBuilder, fileService);
    });

    it('should open a note based on the month and settings', async () => {
        const filePath = 'folder/November-2024.md';
        const settings: MonthlyNotesPeriodicNoteSettings = {
            nameTemplate: 'MMMM-yyyy',
            folder: 'folder',
            templateFile: 'templateFile',
        };

        settingsRepository.getSettings.mockResolvedValueOnce(settings);
        fileNameBuilder.build.mockReturnValueOnce(filePath);

        await manager.tryOpenNote(month);

        expect(settingsRepository.getSettings).toHaveBeenCalled();
        expect(fileService.tryOpenFileWithTemplate).toHaveBeenCalledWith(filePath, settings.templateFile);
    });

    it('should call tryOpenNote when an event is emitted', async () => {
        const filePath = 'folder/November-2024.md';
        const settings: MonthlyNotesPeriodicNoteSettings = {
            nameTemplate: 'MMMM-yyyy',
            folder: 'folder',
            templateFile: 'templateFile',
        };

        settingsRepository.getSettings.mockResolvedValueOnce(settings);
        fileNameBuilder.build.mockReturnValueOnce(filePath);

        const tryOpenNoteSpy = jest.spyOn(manager, 'tryOpenNote');
        event.emitEvent(month);

        expect(tryOpenNoteSpy).toHaveBeenCalledWith(month);
    });
});