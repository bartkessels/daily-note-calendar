import {RepositoryNoteManager} from 'src/business/managers/repository.note-manager';
import {
    mockDateRepository,
    mockDisplayNoteSettingsRepository,
    mockFileRepository,
    mockNoteRepository
} from 'src/test-helpers/repository.mocks';
import {
    mockDateRepositoryFactory,
    mockFileRepositoryFactory,
    mockNoteRepositoryFactory,
    mockSettingsRepositoryFactory
} from 'src/test-helpers/factory.mocks';
import {when} from 'jest-when';
import {Note} from 'src/domain/models/note.model';
import {Period, PeriodType} from 'src/domain/models/period.model';
import {DisplayNotesSettings} from 'src/domain/settings/display-notes.settings';

describe('RepositoryNoteManager', () => {
    let manager: RepositoryNoteManager;
    const fileRepository = mockFileRepository;
    const noteRepository = mockNoteRepository;
    const settingsRepository = mockDisplayNoteSettingsRepository;
    const dateRepository = mockDateRepository;
    const note = <Note>{
        createdOn: <Period>{
            date: new Date(2023, 9, 2),
            name: '2'
        },
        name: 'My own note',
        path: 'resources/notes/my-own-note.md',
        properties: new Map<string, string>()
    };

    beforeEach(() => {
        const fileRepositoryFactory = mockFileRepositoryFactory(fileRepository);
        const noteRepositoryFactory = mockNoteRepositoryFactory(noteRepository);
        const settingsRepositoryFactory = mockSettingsRepositoryFactory(settingsRepository);
        const dateRepositoryFactory = mockDateRepositoryFactory(dateRepository);

        manager = new RepositoryNoteManager(
            fileRepositoryFactory,
            noteRepositoryFactory,
            settingsRepositoryFactory,
            dateRepositoryFactory
        );
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('openNote', () => {
        it('should open the note when it does exist', async () => {
            // Arrange
            when(fileRepository.exists).calledWith(note.path).mockResolvedValue(true);

            // Act
            await manager.openNote(note);

            // Assert
            expect(fileRepository.open).toHaveBeenCalledWith(note.path);
        });

        it('should not open the file when it does not exist', async () => {
            // Arrange
            when(fileRepository.exists).calledWith(note.path).mockResolvedValue(false);

            // Act
            await manager.openNote(note);

            // Assert
            expect(fileRepository.open).not.toHaveBeenCalled();
        });
    });

    describe('deleteNote', () => {
        it('should delete the note when it does exist', async () => {
            // Arrange
            when(fileRepository.exists).calledWith(note.path).mockResolvedValue(true);

            // Act
            await manager.deleteNote(note);

            // Assert
            expect(fileRepository.delete).toHaveBeenCalledWith(note.path);
        });

        it('should not delete the file when it does not exist', async () => {
            // Arrange
            when(fileRepository.exists).calledWith(note.path).mockResolvedValue(false);

            // Act
            await manager.deleteNote(note);

            // Assert
            expect(fileRepository.delete).not.toHaveBeenCalled();
        });
    });

    describe('getActiveNote', () => {
        it('should return the active note with the createdOnProperty set', async () => {
            // Arrange
            const expectedPeriod = <Period>{
                date: new Date(2023, 9, 2),
                name: '2',
                type: PeriodType.Day
            };
            const settings = <DisplayNotesSettings>{
                createdOnDatePropertyName: 'createdOn',
                useCreatedOnDateFromProperties: true,
                createdOnPropertyFormat: 'yyyy-MM-dd'
            };
            note.properties.set(settings.createdOnDatePropertyName, '2023-10-02');

            when(settingsRepository.get).mockResolvedValue(settings);
            when(noteRepository.getActiveNote).mockResolvedValue(note);
            when(dateRepository.getDayFromDateString).calledWith('2023-10-02', settings.createdOnPropertyFormat)
                .mockReturnValue(expectedPeriod);

            // Act
            const result = await manager.getActiveNote();

            // Assert
            expect(result?.createdOnProperty).toEqual(expectedPeriod);
        });

        it('should return the active note without the createdOnProperty set when the date could not be parsed', async () => {
            // Arrange
            const settings = <DisplayNotesSettings>{
                createdOnDatePropertyName: 'createdOn',
                useCreatedOnDateFromProperties: true,
                createdOnPropertyFormat: 'yyyy-MM-dd'
            };
            note.properties.set(settings.createdOnDatePropertyName, 'abcdefg');

            when(settingsRepository.get).mockResolvedValue(settings);
            when(noteRepository.getActiveNote).mockResolvedValue(note);
            when(dateRepository.getDayFromDateString).mockReturnValue(null);

            // Act
            const result = await manager.getActiveNote();

            // Assert
            expect(result).toEqual(note);
            expect(result?.createdOnProperty).toBeUndefined();
        });

        it('should return the active note without the createdOnProperty set when the property is not set', async () => {
            // Arrange
            const settings = <DisplayNotesSettings>{
                createdOnDatePropertyName: 'createdOn',
                useCreatedOnDateFromProperties: true,
                createdOnPropertyFormat: 'yyyy-MM-dd'
            };
            when(settingsRepository.get).mockResolvedValue(settings);
            when(noteRepository.getActiveNote).mockResolvedValue(note);

            note.properties.delete(settings.createdOnDatePropertyName);

            // Act
            const result = await manager.getActiveNote();

            // Assert
            expect(result).toEqual(note);
            expect(result?.createdOnProperty).toBeUndefined();
        });
    });
});