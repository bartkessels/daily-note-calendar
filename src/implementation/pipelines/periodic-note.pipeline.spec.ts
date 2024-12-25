import { PeriodicNotePipeline } from 'src/implementation/pipelines/periodic-note.pipeline';
import { Event } from 'src/domain/events/event';
import { FileService } from 'src/domain/services/file.service';
import { SettingsRepository } from 'src/domain/repositories/settings.repository';
import { PeriodicNoteSettings } from 'src/domain/models/settings/periodic-note.settings';
import { NameBuilder } from 'src/domain/builders/name.builder';
import {DEFAULT_GENERAL_SETTINGS, GeneralSettings} from 'src/domain/models/settings/general.settings';
import { Period } from 'src/domain/models/period';
import { ModifierKey } from 'src/domain/models/modifier-key';
import {Day, DayOfWeek} from 'src/domain/models/day';
import {PeriodicNoteEvent} from 'src/implementation/events/periodic-note.event';

describe('PeriodicNotePipeline', () => {
    let event: Event<Day>;
    let day: Day;
    let fileService: jest.Mocked<FileService>;
    let generalSettingsRepository: jest.Mocked<SettingsRepository<GeneralSettings>>;
    let settingsRepository: jest.Mocked<SettingsRepository<PeriodicNoteSettings>>;
    let nameBuilder: jest.Mocked<NameBuilder<Period>>;
    let pipeline: PeriodicNotePipeline<PeriodicNoteSettings>;

    beforeEach(() => {
        event = new PeriodicNoteEvent<Day>();
        day = {
            dayOfWeek: DayOfWeek.Thursday,
            date: new Date(2024, 12, 5),
            name: '05'
        };
        fileService = {
            doesFileExist: jest.fn(),
            createFileWithTemplate: jest.fn(),
            tryOpenFile: jest.fn()
        } as unknown as jest.Mocked<FileService>;
        generalSettingsRepository = {
            getSettings: jest.fn()
        } as unknown as jest.Mocked<SettingsRepository<GeneralSettings>>;
        settingsRepository = {
            getSettings: jest.fn()
        } as unknown as jest.Mocked<SettingsRepository<PeriodicNoteSettings>>;
        nameBuilder = {
            withNameTemplate: jest.fn().mockReturnThis(),
            withValue: jest.fn().mockReturnThis(),
            withPath: jest.fn().mockReturnThis(),
            build: jest.fn()
        } as unknown as jest.Mocked<NameBuilder<Period>>;

        pipeline = new PeriodicNotePipeline<PeriodicNoteSettings>(
            event,
            fileService,
            generalSettingsRepository,
            settingsRepository,
            nameBuilder
        );
    });

    it('should create a new file if it does not exist and the modifier key is used', async () => {
        const generalSettings: GeneralSettings = {...DEFAULT_GENERAL_SETTINGS, useModifierKeyToCreateNote: true };
        const settings: PeriodicNoteSettings = { nameTemplate: 'template', folder: '/folder', templateFile: 'template.md' };

        generalSettingsRepository.getSettings.mockResolvedValue(generalSettings);
        settingsRepository.getSettings.mockResolvedValue(settings);
        fileService.doesFileExist.mockResolvedValue(false);
        nameBuilder.build.mockReturnValue('/folder/test.md');

        await pipeline.process(day, ModifierKey.Meta);

        expect(fileService.createFileWithTemplate).toHaveBeenCalledWith('/folder/test.md', 'template.md');
        expect(fileService.tryOpenFile).toHaveBeenCalledWith('/folder/test.md');
    });

    it('should not create a new file if it does not exist and the modifier key is not used', async () => {
        const generalSettings: GeneralSettings = { ...DEFAULT_GENERAL_SETTINGS, useModifierKeyToCreateNote: true };
        const settings: PeriodicNoteSettings = { nameTemplate: 'template', folder: '/folder', templateFile: 'template.md' };

        generalSettingsRepository.getSettings.mockResolvedValue(generalSettings);
        settingsRepository.getSettings.mockResolvedValue(settings);
        fileService.doesFileExist.mockResolvedValue(false);
        nameBuilder.build.mockReturnValue('/folder/test.md');

        await pipeline.process(day, ModifierKey.None);

        expect(fileService.createFileWithTemplate).not.toHaveBeenCalled();
        expect(fileService.tryOpenFile).not.toHaveBeenCalled();
    });

    it('should create a new file if it does not exist and the modifier key setting is disabled', async () => {
        const generalSettings: GeneralSettings = { ...DEFAULT_GENERAL_SETTINGS, useModifierKeyToCreateNote: false };
        const settings: PeriodicNoteSettings = { nameTemplate: 'template', folder: '/folder', templateFile: 'template.md' };

        generalSettingsRepository.getSettings.mockResolvedValue(generalSettings);
        settingsRepository.getSettings.mockResolvedValue(settings);
        fileService.doesFileExist.mockResolvedValue(false);
        nameBuilder.build.mockReturnValue('/folder/test.md');

        await pipeline.process(day, ModifierKey.None);

        expect(fileService.createFileWithTemplate).toHaveBeenCalledWith('/folder/test.md', 'template.md');
        expect(fileService.tryOpenFile).toHaveBeenCalledWith('/folder/test.md');
    });

    it('should open the file if it exists', async () => {
        const generalSettings: GeneralSettings = { ...DEFAULT_GENERAL_SETTINGS, useModifierKeyToCreateNote: true };
        const settings: PeriodicNoteSettings = { nameTemplate: 'template', folder: '/folder', templateFile: 'template.md' };

        generalSettingsRepository.getSettings.mockResolvedValue(generalSettings);
        settingsRepository.getSettings.mockResolvedValue(settings);
        fileService.doesFileExist.mockResolvedValue(true);
        nameBuilder.build.mockReturnValue('/folder/test.md');

        await pipeline.process(day, ModifierKey.None);

        expect(fileService.createFileWithTemplate).not.toHaveBeenCalled();
        expect(fileService.tryOpenFile).toHaveBeenCalledWith('/folder/test.md');
    });
});