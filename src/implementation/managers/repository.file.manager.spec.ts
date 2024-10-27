import { RepositoryFileManager } from './repository.file.manager';
import { SettingsRepository } from 'src/domain/repositories/settings.repository';
import { NameBuilder } from 'src/domain/builders/name.builder';
import { FileService } from 'src/domain/services/file.service';
import {Settings} from "../../domain/models/Settings";

describe('RepositoryFileManager', () => {
    let fileManager: RepositoryFileManager;
    let settingsRepository: jest.Mocked<SettingsRepository>;
    let fileNameBuilder: jest.Mocked<NameBuilder<Date>>;
    let fileService: jest.Mocked<FileService>;

    const DEFAULT_SETTINGS: Settings = {
        dailyNoteNameTemplate: 'yyyy-MM-dd - eeee',
        dailyNoteTemplateFile: 'Templates/Daily note',
        dailyNotesFolder: 'Daily notes',
        weeklyNoteNameTemplate: 'yyyy - ww',
        weeklyNoteTemplateFile: 'Templates/Weekly note',
        weeklyNoteFolder: 'Weekly notes'
    }

    beforeEach(() => {
        settingsRepository = {
            getSettings: jest.fn()
        } as unknown as jest.Mocked<SettingsRepository>;

        fileNameBuilder = {
            withNameTemplate: jest.fn().mockReturnThis(),
            withValue: jest.fn().mockReturnThis(),
            withPath: jest.fn().mockReturnThis(),
            build: jest.fn()
        } as unknown as jest.Mocked<NameBuilder<Date>>;

        fileService = {
            tryOpenFile: jest.fn()
        } as unknown as jest.Mocked<FileService>;

        fileManager = new RepositoryFileManager(settingsRepository, fileNameBuilder, fileService);
    });

    it('should try to open daily note with provided date', async () => {
        const date = new Date('2023-10-01');
        const settings = {
            ...DEFAULT_SETTINGS,
            dailyNoteNameTemplate: 'yyyy-MM-dd',
            dailyNotesFolder: '/daily/notes',
            dailyNoteTemplateFile: '/templates/daily.md'
        };
        const filePath = '/daily/notes/2023-10-01.md';

        settingsRepository.getSettings.mockResolvedValue(settings);
        fileNameBuilder.build.mockReturnValue(filePath);

        await fileManager.tryOpenDailyNote(date);

        expect(settingsRepository.getSettings).toHaveBeenCalled();
        expect(fileNameBuilder.withNameTemplate).toHaveBeenCalledWith(settings.dailyNoteNameTemplate);
        expect(fileNameBuilder.withValue).toHaveBeenCalledWith(date);
        expect(fileNameBuilder.withPath).toHaveBeenCalledWith(settings.dailyNotesFolder);
        expect(fileNameBuilder.build).toHaveBeenCalled();
        expect(fileService.tryOpenFile).toHaveBeenCalledWith(filePath, settings.dailyNoteTemplateFile);
    });

    it('should not try to open daily note if date is not provided', async () => {
        await fileManager.tryOpenDailyNote(undefined);

        expect(settingsRepository.getSettings).not.toHaveBeenCalled();
        expect(fileNameBuilder.withNameTemplate).not.toHaveBeenCalled();
        expect(fileNameBuilder.withValue).not.toHaveBeenCalled();
        expect(fileNameBuilder.withPath).not.toHaveBeenCalled();
        expect(fileNameBuilder.build).not.toHaveBeenCalled();
        expect(fileService.tryOpenFile).not.toHaveBeenCalled();
    });

    it('should try to open weekly note with provided date', async () => {
        const date = new Date('2023-10-01');
        const settings = {
            ...DEFAULT_SETTINGS,
            weeklyNoteNameTemplate: 'yyyy-\'W\'ww',
            weeklyNoteFolder: '/weekly/notes',
            weeklyNoteTemplateFile: '/templates/weekly.md'
        };
        const fileName = '/weekly/notes/2023-W40.md';

        settingsRepository.getSettings.mockResolvedValue(settings);
        fileNameBuilder.build.mockReturnValue(fileName);

        await fileManager.tryOpenWeeklyNote(date);

        expect(settingsRepository.getSettings).toHaveBeenCalled();
        expect(fileNameBuilder.withNameTemplate).toHaveBeenCalledWith(settings.weeklyNoteNameTemplate);
        expect(fileNameBuilder.withValue).toHaveBeenCalledWith(date);
        expect(fileNameBuilder.withPath).toHaveBeenCalledWith(settings.weeklyNoteFolder);
        expect(fileNameBuilder.build).toHaveBeenCalled();
        expect(fileService.tryOpenFile).toHaveBeenCalledWith(fileName, settings.weeklyNoteTemplateFile);
    });

    it('should not try to open weekly note if date is not provided', async () => {
        await fileManager.tryOpenWeeklyNote(undefined);

        expect(settingsRepository.getSettings).not.toHaveBeenCalled();
        expect(fileNameBuilder.withNameTemplate).not.toHaveBeenCalled();
        expect(fileNameBuilder.withValue).not.toHaveBeenCalled();
        expect(fileNameBuilder.withPath).not.toHaveBeenCalled();
        expect(fileNameBuilder.build).not.toHaveBeenCalled();
        expect(fileService.tryOpenFile).not.toHaveBeenCalled();
    });
});
