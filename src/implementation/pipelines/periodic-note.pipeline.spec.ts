import {PeriodicNotePipeline} from 'src/implementation/pipelines/periodic-note.pipeline';
import {Event} from 'src/domain/events/event';
import {SettingsRepository} from 'src/domain/repositories/settings.repository';
import {NameBuilder} from 'src/domain/builders/name.builder';
import {FileService} from 'src/domain/services/file.service';
import {PeriodicNoteSettings} from 'src/domain/models/settings/periodic-note.settings';
import {Day, DayOfWeek} from 'src/domain/models/day';
import {DailyNotesPeriodicNoteSettings} from 'src/domain/models/settings/daily-notes.periodic-note-settings';
import {PeriodicNoteEvent} from 'src/implementation/events/periodic-note.event';

describe('PeriodicNotePipeline', () => {
    let event: Event<Day>;
    let day: Day;
    let fileService: FileService;
    let settingsRepository: SettingsRepository<DailyNotesPeriodicNoteSettings>;
    let nameBuilder: NameBuilder<Day>;
    let pipeline: PeriodicNotePipeline<DailyNotesPeriodicNoteSettings>;

    beforeEach(() => {
        event = new PeriodicNoteEvent<Day>();
        day = {
            dayOfWeek: DayOfWeek.Thursday,
            date: new Date(2024, 12, 5),
            name: '05'
        };
        fileService = {
            createFileWithTemplate: jest.fn(),
            doesFileExist: jest.fn().mockResolvedValue(false),
            tryOpenFile: jest.fn()
        } as FileService;
        settingsRepository = {
            storeSettings: jest.fn(),
            getSettings: jest.fn().mockResolvedValue({
                nameTemplate: 'template',
                folder: 'folder',
                templateFile: 'templateFile'
            })
        } as SettingsRepository<PeriodicNoteSettings>;
        nameBuilder = {
            withNameTemplate: jest.fn().mockReturnThis(),
            withValue: jest.fn().mockReturnThis(),
            withPath: jest.fn().mockReturnThis(),
            build: jest.fn().mockReturnValue('filePath')
        } as NameBuilder<Day>;

        pipeline = new PeriodicNotePipeline(event, fileService, settingsRepository, nameBuilder);
    });

    it('should process event and create file if it does not exist', async () => {
        await pipeline.process(day);

        expect(nameBuilder.withNameTemplate).toHaveBeenCalledWith('template');
        expect(nameBuilder.withValue).toHaveBeenCalledWith(day);
        expect(nameBuilder.withPath).toHaveBeenCalledWith('folder');
        expect(nameBuilder.build).toHaveBeenCalled();
        expect(fileService.doesFileExist).toHaveBeenCalledWith('filePath');
        expect(fileService.createFileWithTemplate).toHaveBeenCalledWith('filePath', 'templateFile');
        expect(fileService.tryOpenFile).toHaveBeenCalledWith('filePath');
    });

    it('should not create file if it already exists', async () => {
        (fileService.doesFileExist as jest.Mock).mockResolvedValue(true);
        await pipeline.process(day);

        expect(fileService.createFileWithTemplate).not.toHaveBeenCalled();
        expect(fileService.tryOpenFile).toHaveBeenCalledWith('filePath');
    });
});