import {DefaultPeriodicNoteManager} from 'src/business/managers/default.periodic-note-manager';
import {NameBuilderFactory, NameBuilderType} from 'src/business/contracts/name-builder-factory';
import {VariableParserFactory} from 'src/business/contracts/variable-parser-factory';
import {FileRepositoryFactory} from 'src/infrastructure/contracts/file-repository-factory';
import {NoteRepositoryFactory} from 'src/infrastructure/contracts/note-repository-factory';
import {NameBuilder} from 'src/business/contracts/name-builder';
import {Period} from 'src/domain/models/period.model';
import {VariableParser} from 'src/business/contracts/variable-parser';
import {FileRepository} from 'src/infrastructure/contracts/file-repository';
import {NoteRepository} from 'src/infrastructure/contracts/note-repository';
import {when} from 'jest-when';
import {VariableType} from 'src/domain/models/variable.model';
import {PeriodNoteSettings} from 'src/domain/settings/period-note.settings';
import {Note} from 'src/domain/models/note.model';
import {afterEach} from '@jest/globals';

describe('DefaultPeriodicNoteManager', () => {
    let manager: DefaultPeriodicNoteManager;

    const nameBuilder = {
        withPath: jest.fn((_) => nameBuilder),
        withName: jest.fn((_) => nameBuilder),
        withValue: jest.fn((_) => nameBuilder),
        build: jest.fn()
    } as jest.Mocked<NameBuilder<Period>>;
    const periodVariableParser = {
        parseVariables: jest.fn()
    } as jest.Mocked<VariableParser<Period>>;
    const todayVariableParser = {
        parseVariables: jest.fn()
    } as jest.Mocked<VariableParser<Date>>;
    const titleVariableParser = {
        parseVariables: jest.fn()
    } as jest.Mocked<VariableParser<string>>;
    const fileRepository = {
        exists: jest.fn(),
        create: jest.fn(),
        readContents: jest.fn(),
        writeContents: jest.fn(),
        open: jest.fn(),
        delete: jest.fn()
    } as jest.Mocked<FileRepository>;
    const noteRepository = {
        getActiveNote: jest.fn()
    } as jest.Mocked<NoteRepository>;
    const period = <Period>{
        date: new Date(2023, 9, 2),
        name: '2',
        type: 1
    };
    const dailyNoteSettings = <PeriodNoteSettings>{
        folder: 'daily-notes',
        nameTemplate: 'yyyy-MM-dd',
        templateFile: 'path'
    };
    const completeFilePath = `${dailyNoteSettings.folder}/2023-10-02.md`;

    beforeEach(() => {
        const nameBuilderFactory = {
            getNameBuilder: jest.fn()
        } as jest.Mocked<NameBuilderFactory>;
        const variableParserFactory = {
            getVariableParser: jest.fn()
        } as jest.Mocked<VariableParserFactory>;
        const fileRepositoryFactory = {
            getRepository: jest.fn(() => fileRepository)
        } as jest.Mocked<FileRepositoryFactory>;
        const noteRepositoryFactory = {
            getRepository: jest.fn(() => noteRepository)
        } as jest.Mocked<NoteRepositoryFactory>;

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
            expect(fileRepository.open).toHaveBeenCalledWith(completeFilePath);
        });

        it('should throw an exception when the file does not exist', async () => {
            // Arrange
            when(fileRepository.exists).calledWith(completeFilePath).mockResolvedValue(false);

            // Act
            const result = manager.openNote(dailyNoteSettings, period);

            // Assert
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