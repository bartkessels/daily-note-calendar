import {PeriodicNotePipeline} from 'src/implementation/pipelines/periodic-note.pipeline';
import {FileService} from 'src/domain/services/file.service';
import {SettingsRepository} from 'src/domain/repositories/settings.repository';
import {PeriodicNoteSettings} from 'src/domain/models/settings/periodic-note.settings';
import {NameBuilder} from 'src/domain/builders/name.builder';
import {DEFAULT_GENERAL_SETTINGS, GeneralSettings} from 'src/domain/models/settings/general.settings';
import {Period} from 'src/domain/models/period';
import {ModifierKey} from 'src/domain/models/modifier-key';
import {Day, DayOfWeek} from 'src/domain/models/day';
import {ManageAction, ManageEvent} from 'src/domain/events/manage.event';
import {PeriodicManageEvent} from 'src/implementation/events/periodic.manage-event';
import {waitFor} from '@testing-library/react';

describe('PeriodicNotePipeline', () => {
    let manageEvent: ManageEvent<Day>;
    let day: Day;
    let fileService: jest.Mocked<FileService>;
    let generalSettingsRepository: jest.Mocked<SettingsRepository<GeneralSettings>>;
    let settingsRepository: jest.Mocked<SettingsRepository<PeriodicNoteSettings>>;
    let nameBuilder: jest.Mocked<NameBuilder<Period>>;
    let pipeline: PeriodicNotePipeline<PeriodicNoteSettings>;

    beforeEach(() => {
        manageEvent = new PeriodicManageEvent<Day>();
        day = {
            dayOfWeek: DayOfWeek.Thursday,
            date: new Date(2024, 12, 5),
            name: '05'
        };
        fileService = {
            doesFileExist: jest.fn(),
            createFileWithTemplate: jest.fn(),
            tryOpenFile: jest.fn(),
            tryDeleteFile: jest.fn()
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
            manageEvent,
            fileService,
            generalSettingsRepository,
            settingsRepository,
            nameBuilder
        );
    });

    it('should create a new file if it does not exist and the modifier key is used when opening a file', async () => {
        const generalSettings: GeneralSettings = {...DEFAULT_GENERAL_SETTINGS, useModifierKeyToCreateNote: true };
        const settings: PeriodicNoteSettings = { nameTemplate: 'template', folder: '/folder', templateFile: 'template.md' };

        generalSettingsRepository.getSettings.mockResolvedValue(generalSettings);
        settingsRepository.getSettings.mockResolvedValue(settings);
        fileService.doesFileExist.mockResolvedValue(false);
        nameBuilder.build.mockReturnValue('/folder/test.md');

        await pipeline.process(day, ManageAction.Open, ModifierKey.Meta);

        expect(fileService.createFileWithTemplate).toHaveBeenCalledWith('/folder/test.md', 'template.md');
        expect(fileService.tryOpenFile).toHaveBeenCalledWith('/folder/test.md');
    });

    it('should create a new file if it does not exist and the modifier key is used when previewing a file', async () => {
        const generalSettings: GeneralSettings = {...DEFAULT_GENERAL_SETTINGS, useModifierKeyToCreateNote: true };
        generalSettingsRepository.getSettings.mockResolvedValue(generalSettings);
        fileService.doesFileExist.mockResolvedValue(false);

        await pipeline.process(day, ManageAction.Preview, ModifierKey.Meta);

        expect(fileService.createFileWithTemplate).not.toHaveBeenCalled();
        expect(fileService.tryOpenFile).not.toHaveBeenCalled();
    });

    it('should create a new file if it does not exist and the modifier key is used when deleting a file', async () => {
        const generalSettings: GeneralSettings = {...DEFAULT_GENERAL_SETTINGS, useModifierKeyToCreateNote: true };
        generalSettingsRepository.getSettings.mockResolvedValue(generalSettings);
        fileService.doesFileExist.mockResolvedValue(false);

        await pipeline.process(day, ManageAction.Delete, ModifierKey.Meta);

        expect(fileService.createFileWithTemplate).not.toHaveBeenCalled();
        expect(fileService.tryOpenFile).not.toHaveBeenCalled();
    });

    it('should not create a new file if it does not exist and the modifier key is not used when opening a file', async () => {
        const generalSettings: GeneralSettings = { ...DEFAULT_GENERAL_SETTINGS, useModifierKeyToCreateNote: true };
        const settings: PeriodicNoteSettings = { nameTemplate: 'template', folder: '/folder', templateFile: 'template.md' };

        generalSettingsRepository.getSettings.mockResolvedValue(generalSettings);
        settingsRepository.getSettings.mockResolvedValue(settings);
        fileService.doesFileExist.mockResolvedValue(false);
        nameBuilder.build.mockReturnValue('/folder/test.md');

        await pipeline.process(day, ManageAction.Open, ModifierKey.None);

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

        await pipeline.process(day, ManageAction.Open, ModifierKey.None);

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

        await pipeline.process(day, ManageAction.Open, ModifierKey.None);

        expect(fileService.createFileWithTemplate).not.toHaveBeenCalled();
        expect(fileService.tryOpenFile).toHaveBeenCalledWith('/folder/test.md');
    });

    it('should call tryDeleteFile on the fileService with the file name from the NameBuilder', async () => {
        const generalSettings: GeneralSettings = { ...DEFAULT_GENERAL_SETTINGS, useModifierKeyToCreateNote: true };
        const settings: PeriodicNoteSettings = { nameTemplate: 'template', folder: '/folder', templateFile: 'template.md' };

        generalSettingsRepository.getSettings.mockResolvedValue(generalSettings);
        settingsRepository.getSettings.mockResolvedValue(settings);
        nameBuilder.build.mockReturnValue('/folder/test.md');

        manageEvent.emitEvent(ManageAction.Delete, day);

        await waitFor(() => expect(fileService.tryDeleteFile).toHaveBeenCalledWith('/folder/test.md'));
    });
});