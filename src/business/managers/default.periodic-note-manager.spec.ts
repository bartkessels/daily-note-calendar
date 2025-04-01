import {DefaultPeriodicNoteManager} from 'src/business/managers/default.periodic-note-manager';
import {NameBuilderType} from 'src/business/contracts/name-builder-factory';
import {when} from 'jest-when';
import {VariableType} from 'src/domain/models/variable.model';
import {Note} from 'src/domain/models/note.model';
import {afterEach} from '@jest/globals';
import {mockPeriodNameBuilder} from 'src/test-helpers/builder.mocks';
import {
    mockDateVariableParser,
    mockPeriodVariableParser,
    mockStringVariableParser
} from 'src/test-helpers/parser.mocks';
import {mockFileRepository, mockNoteRepository} from 'src/test-helpers/repository.mocks';
import {
    mockFileRepositoryFactory,
    mockNameBuilderFactory, mockNoteRepositoryFactory,
    mockVariableParserFactory
} from 'src/test-helpers/factory.mocks';
import {mockDailyNoteSettings, mockPeriod} from 'src/test-helpers/model.mocks';

describe('DefaultPeriodicNoteManager', () => {
    let manager: DefaultPeriodicNoteManager;

    const nameBuilder = mockPeriodNameBuilder;
    const periodVariableParser = mockPeriodVariableParser;
    const todayVariableParser = mockDateVariableParser;
    const titleVariableParser = mockStringVariableParser;
    const fileRepository = mockFileRepository;
    const noteRepository = mockNoteRepository;
    const period = mockPeriod;
    const dailyNoteSettings = mockDailyNoteSettings;
    const completeFilePath = `${dailyNoteSettings.folder}/2023-10-02.md`;

    beforeEach(() => {
        const nameBuilderFactory = mockNameBuilderFactory(nameBuilder);
        const variableParserFactory = mockVariableParserFactory();
        const fileRepositoryFactory = mockFileRepositoryFactory(fileRepository);
        const noteRepositoryFactory = mockNoteRepositoryFactory(noteRepository);

        manager = new DefaultPeriodicNoteManager(
            nameBuilderFactory,
            variableParserFactory,
            fileRepositoryFactory,
            noteRepositoryFactory
        );

        when(nameBuilder.build).mockReturnValue('daily-notes/2023-10-02.md');
        when(periodVariableParser.parseVariables).mockReturnValue('');
        when(todayVariableParser.parseVariables).mockReturnValue('');
        when(titleVariableParser.parseVariables).mockReturnValue('');

        when(nameBuilderFactory.getNameBuilder).calledWith(NameBuilderType.PeriodicNote).mockReturnValue(nameBuilder);
        when(variableParserFactory.getVariableParser)
            .calledWith(VariableType.Date).mockReturnValue(periodVariableParser)
            .calledWith(VariableType.Today).mockReturnValue(todayVariableParser)
            .calledWith(VariableType.Title).mockReturnValue(titleVariableParser);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('doesNoteExist', () => {
        it('should return true when the file exists', async () => {
            // Arrange
            when(fileRepository.exists).calledWith(completeFilePath).mockResolvedValue(true);

            // Act
            const result = await manager.doesNoteExist(dailyNoteSettings, period);

            // Assert
            expect(result).toBe(true);
        });

        it('should return false when the file does not exist', async () => {
            // Arrange
            when(fileRepository.exists).calledWith(completeFilePath).mockResolvedValue(false);

            // Act
            const result = await manager.doesNoteExist(dailyNoteSettings, period);

            // Assert
            expect(result).toBe(false);
        });
    });

    describe('createNote', () => {
        it('should create a new note when the file does not exist', async () => {
            // Arrange
            when(fileRepository.exists).calledWith(completeFilePath).mockResolvedValue(false);

            // Act
            await manager.createNote(dailyNoteSettings, period);

            // Assert
            expect(fileRepository.create).toHaveBeenCalledWith(completeFilePath, dailyNoteSettings.templateFile);
        });

        it('should parse the variables when the file does not exist', async () => {
            // Arrange
            const today = new Date(2023, 10, 2);
            const fileContent = 'this is my content';
            const activeNote = <Note>{
                createdOn: period,
                name: 'My own note',
                path: 'notes/my-own-note.md',
                properties: new Map<string, string>()
            };

            when(fileRepository.exists).calledWith(completeFilePath).mockResolvedValue(false);
            when(fileRepository.create).mockResolvedValue(completeFilePath);
            when(fileRepository.readContents).calledWith(completeFilePath).mockResolvedValue(fileContent);
            when(noteRepository.getActiveNote).mockResolvedValue(activeNote);

            when(titleVariableParser.parseVariables).mockReturnValue(fileContent);
            when(periodVariableParser.parseVariables).mockReturnValue(fileContent);
            when(todayVariableParser.parseVariables).mockReturnValue(fileContent);

            // Act
            jest.useFakeTimers();
            jest.setSystemTime(today);
            await manager.createNote(dailyNoteSettings, period);

            // Assert
            expect(titleVariableParser.parseVariables).toHaveBeenCalledWith(fileContent, activeNote.name);
            expect(periodVariableParser.parseVariables).toHaveBeenCalledWith(fileContent, period);
            expect(todayVariableParser.parseVariables).toHaveBeenCalledWith(fileContent, today);

            // Teardown
            jest.useRealTimers();
        });

        it('should not create a new note when the file already exists', async () => {
            // Arrange
            when(fileRepository.exists).calledWith(completeFilePath).mockResolvedValue(true);

            // Act
            await manager.createNote(dailyNoteSettings, period);

            // Assert
            expect(fileRepository.create).not.toHaveBeenCalled();
        });

        it('should not parse the variables when the file already exist', async () => {
            // Arrange
            when(fileRepository.exists).calledWith(completeFilePath).mockResolvedValue(true);

            // Act
            await manager.createNote(dailyNoteSettings, period);

            // Assert
            expect(fileRepository.readContents).not.toHaveBeenCalled();
            expect(noteRepository.getActiveNote).not.toHaveBeenCalled();
            expect(titleVariableParser.parseVariables).not.toHaveBeenCalled();
            expect(periodVariableParser.parseVariables).not.toHaveBeenCalled();
            expect(todayVariableParser.parseVariables).not.toHaveBeenCalled();
        });
    });

    describe('openNote', () => {
        it('should open the note when it does exist', async () => {
            // Arrange
            when(fileRepository.exists).calledWith(completeFilePath).mockResolvedValue(true);

            // Act
            await manager.openNote(dailyNoteSettings, period);

            // Assert
            expect(fileRepository.openInCurrentTab).toHaveBeenCalledWith(completeFilePath);
        });

        it('should throw an exception when the file does not exist', async () => {
            // Arrange
            when(fileRepository.exists).calledWith(completeFilePath).mockResolvedValue(false);

            // Act
            const result = manager.openNote(dailyNoteSettings, period);

            // Assert
            expect(fileRepository.openInCurrentTab).not.toHaveBeenCalled();
            await expect(result).rejects.toThrow('File does not exist');
        });
    });

    describe('openNoteInHorizontalSplit', () => {
        it('should open the note when it does exist', async () => {
            // Arrange
            when(fileRepository.exists).calledWith(completeFilePath).mockResolvedValue(true);

            // Act
            await manager.openNoteInHorizontalSplitView(dailyNoteSettings, period);

            // Assert
            expect(fileRepository.openInHorizontalSplitView).toHaveBeenCalledWith(completeFilePath);
        });

        it('should throw an exception when the file does not exist', async () => {
            // Arrange
            when(fileRepository.exists).calledWith(completeFilePath).mockResolvedValue(false);

            // Act
            const result = manager.openNoteInHorizontalSplitView(dailyNoteSettings, period);

            // Assert
            expect(fileRepository.openInHorizontalSplitView).not.toHaveBeenCalled();
            await expect(result).rejects.toThrow('File does not exist');
        });
    });

    describe('openNoteInVerticalSplit', () => {
        it('should open the note when it does exist', async () => {
            // Arrange
            when(fileRepository.exists).calledWith(completeFilePath).mockResolvedValue(true);

            // Act
            await manager.openNoteInVerticalSplitView(dailyNoteSettings, period);

            // Assert
            expect(fileRepository.openInVerticalSplitView).toHaveBeenCalledWith(completeFilePath);
        });

        it('should throw an exception when the file does not exist', async () => {
            // Arrange
            when(fileRepository.exists).calledWith(completeFilePath).mockResolvedValue(false);

            // Act
            const result = manager.openNoteInVerticalSplitView(dailyNoteSettings, period);

            // Assert
            expect(fileRepository.openInVerticalSplitView).not.toHaveBeenCalled();
            await expect(result).rejects.toThrow('File does not exist');
        });
    });

    describe('deleteNote', () => {
        it('should delete the note when it does exist', async () => {
            // Arrange
            when(fileRepository.exists).calledWith(completeFilePath).mockResolvedValue(true);

            // Act
            await manager.deleteNote(dailyNoteSettings, period);

            // Assert
            expect(fileRepository.delete).toHaveBeenCalledWith(completeFilePath);
        });

        it('should throw an exception when the file does not exist', async () => {
            // Arrange
            when(fileRepository.exists).calledWith(completeFilePath).mockResolvedValue(false);

            // Act
            const result = manager.deleteNote(dailyNoteSettings, period);

            // Assert
            await expect(result).rejects.toThrow('File does not exist');
        });
    });
});