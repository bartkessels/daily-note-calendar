import {RepositoryNoteManager} from 'src/business/managers/repository.note-manager';
import {
    mockDisplayNoteSettingsRepository,
    mockFileRepository, mockGeneralSettingsRepository,
    mockNoteRepository
} from 'src/test-helpers/repository.mocks';
import {
    mockFileRepositoryFactory,
    mockNoteRepositoryFactory, mockSettingsRepositoryFactory,
} from 'src/test-helpers/factory.mocks';
import {when} from 'jest-when';
import {Note, SortNotes} from 'src/domain/models/note.model';
import {Period, PeriodType} from 'src/domain/models/period.model';
import {DEFAULT_DISPLAY_NOTES_SETTINGS, DisplayNotesSettings} from 'src/domain/settings/display-notes.settings';
import {SettingsType} from 'src/infrastructure/contracts/settings-repository-factory';
import {DEFAULT_GENERAL_SETTINGS, GeneralSettings} from 'src/domain/settings/general.settings';

describe('RepositoryNoteManager', () => {
    let manager: RepositoryNoteManager;
    const fileRepository = mockFileRepository;
    const noteRepository = mockNoteRepository;
    const generalSettingsRepository = mockGeneralSettingsRepository;
    const displayNoteSettingsRepository = mockDisplayNoteSettingsRepository;
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
        const settingsRepositoryFactory = mockSettingsRepositoryFactory(displayNoteSettingsRepository);

        manager = new RepositoryNoteManager(
            fileRepositoryFactory,
            noteRepositoryFactory,
            settingsRepositoryFactory
        );

        when(settingsRepositoryFactory.getRepository)
            .calledWith(SettingsType.General)
            .mockReturnValue(generalSettingsRepository)
            .calledWith(SettingsType.DisplayNotes)
            .mockReturnValue(displayNoteSettingsRepository);
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
            expect(fileRepository.openInCurrentTab).toHaveBeenCalledWith(note.path);
        });

        it('should not open the file when it does not exist', async () => {
            // Arrange
            when(fileRepository.exists).calledWith(note.path).mockResolvedValue(false);

            // Act
            await manager.openNote(note);

            // Assert
            expect(fileRepository.openInCurrentTab).not.toHaveBeenCalled();
        });
    });

    describe('openNoteInHorizontalSplit', () => {
        it('should open the note when it does exist', async () => {
            // Arrange
            when(fileRepository.exists).calledWith(note.path).mockResolvedValue(true);

            // Act
            await manager.openNoteInHorizontalSplitView(note);

            // Assert
            expect(fileRepository.openInHorizontalSplitView).toHaveBeenCalledWith(note.path);
        });

        it('should not open the file when it does not exist', async () => {
            // Arrange
            when(fileRepository.exists).calledWith(note.path).mockResolvedValue(false);

            // Act
            await manager.openNoteInHorizontalSplitView(note);

            // Assert
            expect(fileRepository.openInHorizontalSplitView).not.toHaveBeenCalled();
        });
    });

    describe('openNoteInVerticalSplit', () => {
        it('should open the note when it does exist', async () => {
            // Arrange
            when(fileRepository.exists).calledWith(note.path).mockResolvedValue(true);

            // Act
            await manager.openNoteInVerticalSplitView(note);

            // Assert
            expect(fileRepository.openInVerticalSplitView).toHaveBeenCalledWith(note.path);
        });

        it('should not open the file when it does not exist', async () => {
            // Arrange
            when(fileRepository.exists).calledWith(note.path).mockResolvedValue(false);

            // Act
            await manager.openNoteInVerticalSplitView(note);

            // Assert
            expect(fileRepository.openInVerticalSplitView).not.toHaveBeenCalled();
        });
    });

    describe('getNotesForPeriod', () => {
        const period = <Period>{
            date: new Date(2023, 9, 2),
            name: '2',
            type: PeriodType.Day
        };
        const noteWithCreatedOnProperty = <Note>{
            createdOn: period,
            createdOnProperty: period,
            name: 'Matching Note',
            path: 'path/to/matching-note.md',
            properties: new Map<string, string>()
        };
        const noteWithoutCreatedOnProperty = <Note>{
            createdOn: <Period>{
                date: new Date(2023, 9, 3),
                name: '3',
                type: PeriodType.Day
            },
            name: 'Non-Matching Note',
            path: 'path/to/non-matching-note.md',
            properties: new Map<string, string>()
        };

        beforeEach(() => {
            when(generalSettingsRepository.get).mockResolvedValue(<GeneralSettings> {
                ...DEFAULT_GENERAL_SETTINGS,
                displayNotesCreatedOnDate: true
            });
        });

        afterEach(() => {
            jest.clearAllMocks();
        });

        it('should not return any notes when the setting to display notes is disabled', async () => {
            // Arrange
            const generalSettings = <GeneralSettings> {
                ...DEFAULT_GENERAL_SETTINGS,
                displayNotesCreatedOnDate: false
            };

            when(generalSettingsRepository.get).mockResolvedValue(generalSettings);

            // Act
            const result = await manager.getNotesForPeriod(period);

            // Assert
            expect(noteRepository.getNotes).not.toHaveBeenCalled();
            expect(displayNoteSettingsRepository.get).not.toHaveBeenCalled();
            expect(result).toEqual([]);
        });

        it('should filter notes based on the createdOnProperty if it has a value and the setting is set to true', async () => {
            // Arrange
            const settings = <DisplayNotesSettings>{
                ...DEFAULT_DISPLAY_NOTES_SETTINGS,
                useCreatedOnDateFromProperties: true
            };
            when(displayNoteSettingsRepository.get).mockResolvedValue(settings);
            when(noteRepository.getNotes).mockImplementation((filterFn) => {
                return Promise.resolve([noteWithCreatedOnProperty, noteWithoutCreatedOnProperty].filter(filterFn));
            });

            // Act
            const result = await manager.getNotesForPeriod(period);

            // Assert
            expect(result).toEqual([noteWithCreatedOnProperty]);
        });

        it('should return no notes when the createdOnProperty is not set but the setting is set to true', async () => {
            // Arrange
            const settings = <DisplayNotesSettings>{
                ...DEFAULT_DISPLAY_NOTES_SETTINGS,
                useCreatedOnDateFromProperties: true
            };
            when(displayNoteSettingsRepository.get).mockResolvedValue(settings);
            when(noteRepository.getNotes).mockImplementation((filterFn) => {
                return Promise.resolve([noteWithoutCreatedOnProperty].filter(filterFn));
            });

            // Act
            const result = await manager.getNotesForPeriod(period);

            // Assert
            expect(result).toEqual([]);
        });

        it('should return the notes based on the createdOn if the setting is set to false', async () => {
            // Arrange
            const settings = <DisplayNotesSettings>{
                ...DEFAULT_DISPLAY_NOTES_SETTINGS,
                useCreatedOnDateFromProperties: false
            };
            when(displayNoteSettingsRepository.get).mockResolvedValue(settings);
            when(noteRepository.getNotes).mockImplementation((filterFn) => {
                return Promise.resolve([noteWithCreatedOnProperty, noteWithoutCreatedOnProperty].filter(filterFn));
            });

            // Act
            const result = await manager.getNotesForPeriod(noteWithoutCreatedOnProperty.createdOn);

            // Assert
            expect(result).toEqual([noteWithoutCreatedOnProperty]);
        });

        it('should return an empty list when the adapter repository returns an empty list', async () => {
            // Arrange
            when(noteRepository.getNotes).mockResolvedValue([]);

            // Act
            const result = await manager.getNotesForPeriod(period);

            // Assert
            expect(result).toEqual([]);
        });

        it('should return the notes in ascending order when the setting is set to Ascending based on the created date', async () => {
            // Arrange
            const firstNote = <Note>{
                createdOn: <Period>{
                    date: new Date(2023, 9, 3),
                    name: '3',
                    type: PeriodType.Day
                },
                name: 'first note',
                path: 'path/to/first-note.md',
                properties: new Map<string, string>()
            };
            const secondNote = <Note>{
                createdOn: <Period>{
                    date: new Date(2023, 9, 4),
                    name: '4',
                    type: PeriodType.Day
                },
                name: 'second note',
                path: 'path/to/second-note.md',
                properties: new Map<string, string>()
            };
            const thirdNote = <Note>{
                createdOn: <Period>{
                    date: new Date(2023, 9, 7),
                    name: '7',
                    type: PeriodType.Day
                },
                name: 'third note',
                path: 'path/to/third-note.md',
                properties: new Map<string, string>()
            };

            const settings = {...DEFAULT_DISPLAY_NOTES_SETTINGS, useCreatedOnDateFromProperties: false, sortNotes: SortNotes.Ascending};
            when(displayNoteSettingsRepository.get).mockResolvedValue(settings);
            when(noteRepository.getNotes).mockResolvedValue([thirdNote, firstNote, secondNote]);

            // Act
            const result = await manager.getNotesForPeriod(period);

            // Assert
            expect(result).toEqual([firstNote, secondNote, thirdNote]);
        });

        it('should return the notes in descending order when the setting is set to Descending based on the created date', async () => {
            // Arrange
            const firstNote = <Note>{
                createdOn: <Period>{
                    date: new Date(2023, 9, 3),
                    name: '3',
                    type: PeriodType.Day
                },
                name: 'first note',
                path: 'path/to/first-note.md',
                properties: new Map<string, string>()
            };
            const secondNote = <Note>{
                createdOn: <Period>{
                    date: new Date(2023, 9, 4),
                    name: '4',
                    type: PeriodType.Day
                },
                name: 'second note',
                path: 'path/to/second-note.md',
                properties: new Map<string, string>()
            };
            const thirdNote = <Note>{
                createdOn: <Period>{
                    date: new Date(2023, 9, 7),
                    name: '7',
                    type: PeriodType.Day
                },
                name: 'third note',
                path: 'path/to/third-note.md',
                properties: new Map<string, string>()
            };

            const settings = {...DEFAULT_DISPLAY_NOTES_SETTINGS, useCreatedOnDateFromProperties: false, sortNotes: SortNotes.Descending};
            when(displayNoteSettingsRepository.get).mockResolvedValue(settings);
            when(noteRepository.getNotes).mockResolvedValue([thirdNote, firstNote, secondNote]);

            // Act
            const result = await manager.getNotesForPeriod(period);

            // Assert
            expect(result).toEqual([thirdNote, secondNote, firstNote]);
        });

        it('should return the notes in ascending order when the setting is set to Ascending based on the created property', async () => {
            // Arrange
            const firstNote = <Note>{
                createdOn: <Period>{
                    date: new Date(2023, 9, 5),
                    name: '3',
                    type: PeriodType.Day
                },
                createdOnProperty: <Period>{
                    date: new Date(2023, 9, 2),
                    name: '2',
                    type: PeriodType.Day
                },
                name: 'first note',
                path: 'path/to/first-note.md',
                properties: new Map<string, string>()
            };
            const secondNote = <Note>{
                createdOn: <Period>{
                    date: new Date(2023, 9, 4),
                    name: '4',
                    type: PeriodType.Day
                },
                createdOnProperty: <Period>{
                    date: new Date(2023, 9, 3),
                    name: '3',
                    type: PeriodType.Day
                },
                name: 'second note',
                path: 'path/to/second-note.md',
                properties: new Map<string, string>()
            };
            const thirdNote = <Note>{
                createdOn: <Period>{
                    date: new Date(2023, 9, 7),
                    name: '7',
                    type: PeriodType.Day
                },
                createdOnProperty: <Period>{
                    date: new Date(2023, 9, 4),
                    name: '4',
                    type: PeriodType.Day
                },
                name: 'third note',
                path: 'path/to/third-note.md',
                properties: new Map<string, string>()
            };

            const settings = {
                ...DEFAULT_DISPLAY_NOTES_SETTINGS,
                createdOnDatePropertyName: 'created_on',
                createdOnPropertyFormat: 'yyyy-MM-dd',
                useCreatedOnDateFromProperties: true,
                sortNotes: SortNotes.Ascending
            };
            when(displayNoteSettingsRepository.get).mockResolvedValue(settings);
            when(noteRepository.getNotes).mockResolvedValue([thirdNote, firstNote, secondNote]);

            // Act
            const result = await manager.getNotesForPeriod(period);

            // Assert
            expect(result).toEqual([firstNote, secondNote, thirdNote]);
        });

        it('should return the notes in ascending order when the setting is set to Descending based on the created property', async () => {
            // Arrange
            const firstNote = <Note>{
                createdOn: <Period>{
                    date: new Date(2023, 9, 5),
                    name: '3',
                    type: PeriodType.Day
                },
                createdOnProperty: <Period>{
                    date: new Date(2023, 9, 4),
                    name: '4',
                    type: PeriodType.Day
                },
                name: 'first note',
                path: 'path/to/first-note.md',
                properties: new Map<string, string>()
            };
            const secondNote = <Note>{
                createdOn: <Period>{
                    date: new Date(2023, 9, 4),
                    name: '4',
                    type: PeriodType.Day
                },
                createdOnProperty: <Period>{
                    date: new Date(2023, 9, 3),
                    name: '3',
                    type: PeriodType.Day
                },
                name: 'second note',
                path: 'path/to/second-note.md',
                properties: new Map<string, string>()
            };
            const thirdNote = <Note>{
                createdOn: <Period>{
                    date: new Date(2023, 9, 7),
                    name: '7',
                    type: PeriodType.Day
                },
                createdOnProperty: <Period>{
                    date: new Date(2023, 9, 2),
                    name: '2',
                    type: PeriodType.Day
                },
                name: 'third note',
                path: 'path/to/third-note.md',
                properties: new Map<string, string>()
            };

            const settings = {
                ...DEFAULT_DISPLAY_NOTES_SETTINGS,
                createdOnDatePropertyName: 'created_on',
                createdOnPropertyFormat: 'yyyy-MM-dd',
                useCreatedOnDateFromProperties: true,
                sortNotes: SortNotes.Ascending
            };
            when(displayNoteSettingsRepository.get).mockResolvedValue(settings);
            when(noteRepository.getNotes).mockResolvedValue([thirdNote, firstNote, secondNote]);

            // Act
            const result = await manager.getNotesForPeriod(period);

            // Assert
            expect(result).toEqual([thirdNote, secondNote, firstNote]);
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
        it('should return the active note from the repository', async () => {
            // Arrange
            when(noteRepository.getActiveNote).mockResolvedValue(note);

            // Act
            const result = await manager.getActiveNote();

            // Assert
            expect(noteRepository.getActiveNote).toHaveBeenCalled();
            expect(result).toEqual(note);
        });
    });
});