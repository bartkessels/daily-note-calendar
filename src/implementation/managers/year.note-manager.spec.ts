import {Event} from 'src/domain/events/event';
import {Week} from 'src/domain/models/week';
import {SettingsRepository} from 'src/domain/repositories/settings.repository';
import {NameBuilder} from 'src/domain/builders/name.builder';
import {FileService} from 'src/domain/services/file.service';
import {jest} from '@jest/globals';
import {Day, DayOfWeek} from 'src/domain/models/day';
import {Year} from 'src/domain/models/year';
import {YearlyNoteManager} from 'src/implementation/managers/yearly.note-manager';
import {Month} from 'src/domain/models/month';
import {YearlyNoteEvent} from 'src/implementation/events/yearly-note.event';
import {YearlyNotesPeriodicNoteSettings} from 'src/domain/models/settings/yearly-notes.periodic-note-settings';

describe('YearlyNoteManager', () => {
    let event: Event<Year>;
    let settingsRepository: jest.Mocked<SettingsRepository<YearlyNotesPeriodicNoteSettings>>;
    let fileNameBuilder: jest.Mocked<NameBuilder<Year>>;
    let fileService: jest.Mocked<FileService>;
    let year: Year;
    let manager: YearlyNoteManager;

    beforeEach(() => {
        event = new YearlyNoteEvent();
        settingsRepository = {
            getSettings: jest.fn(),
            storeSettings: jest.fn(),
        } as jest.Mocked<SettingsRepository<YearlyNotesPeriodicNoteSettings>>;
        fileNameBuilder = {
            withNameTemplate: jest.fn().mockReturnThis(),
            withValue: jest.fn().mockReturnThis(),
            withPath: jest.fn().mockReturnThis(),
            build: jest.fn(),
        } as jest.Mocked<NameBuilder<Year>>;
        fileService = {
            tryOpenFileWithTemplate: jest.fn(),
            tryOpenFile: jest.fn()
        } as jest.Mocked<FileService>;
        year = {
            year: 2024,
            name: '2024',
            months: [<Month>{
                monthIndex: 11,
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
            }]
        };
        manager = new YearlyNoteManager(event, settingsRepository, fileNameBuilder, fileService);
    });

    it('should open a note based on the week and settings', async () => {
        const filePath = 'folder/Week-46-2024.md';
        const settings: YearlyNotesPeriodicNoteSettings = {
            nameTemplate: 'yyyy',
            folder: 'folder',
            templateFile: 'templateFile',
        };

        settingsRepository.getSettings.mockResolvedValueOnce(settings);
        fileNameBuilder.build.mockReturnValueOnce(filePath);

        await manager.tryOpenNote(year);

        expect(settingsRepository.getSettings).toHaveBeenCalled();
        expect(fileService.tryOpenFileWithTemplate).toHaveBeenCalledWith(filePath, settings.templateFile);
    });

    it('should call tryOpenNote when an event is emitted', async () => {
        const filePath = 'folder/Week-46-2024.md';
        const settings: YearlyNotesPeriodicNoteSettings = {
            nameTemplate: 'yyyy',
            folder: 'folder',
            templateFile: 'templateFile',
        };

        settingsRepository.getSettings.mockResolvedValueOnce(settings);
        fileNameBuilder.build.mockReturnValueOnce(filePath);

        const tryOpenNoteSpy = jest.spyOn(manager, 'tryOpenNote');
        event.emitEvent(year);

        expect(tryOpenNoteSpy).toHaveBeenCalledWith(year);
    });
});