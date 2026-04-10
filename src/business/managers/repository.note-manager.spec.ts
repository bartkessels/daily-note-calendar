import {RepositoryNoteManager} from 'src/business/managers/repository.note-manager';
import {
    mockDisplayNoteSettingsRepository,
    mockFileRepository, mockGeneralSettingsRepository,
    mockNoteRepository,
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
    let fileRepository: typeof mockFileRepository;
    let noteRepository: typeof mockNoteRepository;
    let generalSettingsRepository: typeof mockGeneralSettingsRepository;
    let displayNoteSettingsRepository: typeof mockDisplayNoteSettingsRepository;
    let note: Note;

    beforeEach(() => {
        fileRepository = mockFileRepository;
        noteRepository = mockNoteRepository;
        generalSettingsRepository = mockGeneralSettingsRepository;
        displayNoteSettingsRepository = mockDisplayNoteSettingsRepository;
        note = <Note>{
            createdOn: <Period>{
                date: new Date(2023, 9, 2),
                name: '2',
            },
            name: 'My own note',
            path: 'resources/notes/my-own-note.md',
            properties: new Map<string, string>(),
        };

        const fileRepositoryFactory = mockFileRepositoryFactory(fileRepository);
        const noteRepositoryFactory = mockNoteRepositoryFactory(noteRepository);
        const settingsRepositoryFactory = mockSettingsRepositoryFactory(displayNoteSettingsRepository);

        manager = new RepositoryNoteManager(
            fileRepositoryFactory,
            noteRepositoryFactory,
            settingsRepositoryFactory,
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
            type: PeriodType.Day,
        };
        const noteWithCreatedOnProperty = <Note>{
            createdOn: period,
            createdOnProperty: period,
            name: 'Matching Note',
            path: 'path/to/matching-note.md',
            properties: new Map<string, string>(),
        };
        const noteWithoutCreatedOnProperty = <Note>{
            createdOn: <Period>{
                date: new Date(2023, 9, 3),
                name: '3',
                type: PeriodType.Day,
            },
            name: 'Non-Matching Note',
            path: 'path/to/non-matching-note.md',
            properties: new Map<string, string>(),
        };

        beforeEach(() => {
            when(generalSettingsRepository.get).mockResolvedValue(<GeneralSettings> {
                ...DEFAULT_GENERAL_SETTINGS,
                displayNotesCreatedOnDate: true,
            });
        });

        afterEach(() => {
            jest.clearAllMocks();
        });

        it('should not return any notes when the setting to display notes is disabled', async () => {
            // Arrange
            const generalSettings = <GeneralSettings> {
                ...DEFAULT_GENERAL_SETTINGS,
                displayNotesCreatedOnDate: false,
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
                useCreatedOnDateFromProperties: true,
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
                useCreatedOnDateFromProperties: true,
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
                useCreatedOnDateFromProperties: false,
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

        it('should filter multiple notes correctly when useCreatedOnDateFromProperties is true', async () => {
            // Arrange
            const matchingNote1 = <Note>{
                createdOn: <Period>{
                    date: new Date(2023, 9, 3),
                    name: '3',
                    type: PeriodType.Day,
                },
                createdOnProperty: period,
                name: 'Matching Note 1',
                path: 'path/to/matching-note-1.md',
                properties: new Map<string, string>(),
            };
            const matchingNote2 = <Note>{
                createdOn: <Period>{
                    date: new Date(2023, 9, 4),
                    name: '4',
                    type: PeriodType.Day,
                },
                createdOnProperty: period,
                name: 'Matching Note 2',
                path: 'path/to/matching-note-2.md',
                properties: new Map<string, string>(),
            };
            const nonMatchingNote = <Note>{
                createdOn: <Period>{
                    date: new Date(2023, 9, 5),
                    name: '5',
                    type: PeriodType.Day,
                },
                createdOnProperty: <Period>{
                    date: new Date(2023, 9, 5),
                    name: '5',
                    type: PeriodType.Day,
                },
                name: 'Non-Matching Note',
                path: 'path/to/non-matching-note.md',
                properties: new Map<string, string>(),
            };

            const settings = <DisplayNotesSettings>{
                ...DEFAULT_DISPLAY_NOTES_SETTINGS,
                useCreatedOnDateFromProperties: true,
            };
            when(displayNoteSettingsRepository.get).mockResolvedValue(settings);
            when(noteRepository.getNotes).mockImplementation((filterFn) => {
                return Promise.resolve([matchingNote1, nonMatchingNote, matchingNote2].filter(filterFn));
            });

            // Act
            const result = await manager.getNotesForPeriod(period);

            // Assert
            expect(result).toHaveLength(2);
            expect(result).toContain(matchingNote1);
            expect(result).toContain(matchingNote2);
            expect(result).not.toContain(nonMatchingNote);
        });

        it('should return the notes in ascending order when the setting is set to Ascending based on the created date', async () => {
            // Arrange
            const firstNote = <Note>{
                createdOn: <Period>{
                    date: new Date(2023, 9, 3),
                    name: '3',
                    type: PeriodType.Day,
                },
                name: 'first note',
                path: 'path/to/first-note.md',
                properties: new Map<string, string>(),
            };
            const secondNote = <Note>{
                createdOn: <Period>{
                    date: new Date(2023, 9, 4),
                    name: '4',
                    type: PeriodType.Day,
                },
                name: 'second note',
                path: 'path/to/second-note.md',
                properties: new Map<string, string>(),
            };
            const thirdNote = <Note>{
                createdOn: <Period>{
                    date: new Date(2023, 9, 7),
                    name: '7',
                    type: PeriodType.Day,
                },
                name: 'third note',
                path: 'path/to/third-note.md',
                properties: new Map<string, string>(),
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
                    type: PeriodType.Day,
                },
                name: 'first note',
                path: 'path/to/first-note.md',
                properties: new Map<string, string>(),
            };
            const secondNote = <Note>{
                createdOn: <Period>{
                    date: new Date(2023, 9, 4),
                    name: '4',
                    type: PeriodType.Day,
                },
                name: 'second note',
                path: 'path/to/second-note.md',
                properties: new Map<string, string>(),
            };
            const thirdNote = <Note>{
                createdOn: <Period>{
                    date: new Date(2023, 9, 7),
                    name: '7',
                    type: PeriodType.Day,
                },
                name: 'third note',
                path: 'path/to/third-note.md',
                properties: new Map<string, string>(),
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
                    type: PeriodType.Day,
                },
                createdOnProperty: <Period>{
                    date: new Date(2023, 9, 2),
                    name: '2',
                    type: PeriodType.Day,
                },
                name: 'first note',
                path: 'path/to/first-note.md',
                properties: new Map<string, string>(),
            };
            const secondNote = <Note>{
                createdOn: <Period>{
                    date: new Date(2023, 9, 4),
                    name: '4',
                    type: PeriodType.Day,
                },
                createdOnProperty: <Period>{
                    date: new Date(2023, 9, 3),
                    name: '3',
                    type: PeriodType.Day,
                },
                name: 'second note',
                path: 'path/to/second-note.md',
                properties: new Map<string, string>(),
            };
            const thirdNote = <Note>{
                createdOn: <Period>{
                    date: new Date(2023, 9, 7),
                    name: '7',
                    type: PeriodType.Day,
                },
                createdOnProperty: <Period>{
                    date: new Date(2023, 9, 4),
                    name: '4',
                    type: PeriodType.Day,
                },
                name: 'third note',
                path: 'path/to/third-note.md',
                properties: new Map<string, string>(),
            };

            const settings = {
                ...DEFAULT_DISPLAY_NOTES_SETTINGS,
                createdOnDatePropertyName: 'created_on',
                createdOnPropertyFormat: 'yyyy-MM-dd',
                useCreatedOnDateFromProperties: true,
                sortNotes: SortNotes.Ascending,
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
                    type: PeriodType.Day,
                },
                createdOnProperty: <Period>{
                    date: new Date(2023, 9, 4),
                    name: '4',
                    type: PeriodType.Day,
                },
                name: 'first note',
                path: 'path/to/first-note.md',
                properties: new Map<string, string>(),
            };
            const secondNote = <Note>{
                createdOn: <Period>{
                    date: new Date(2023, 9, 4),
                    name: '4',
                    type: PeriodType.Day,
                },
                createdOnProperty: <Period>{
                    date: new Date(2023, 9, 3),
                    name: '3',
                    type: PeriodType.Day,
                },
                name: 'second note',
                path: 'path/to/second-note.md',
                properties: new Map<string, string>(),
            };
            const thirdNote = <Note>{
                createdOn: <Period>{
                    date: new Date(2023, 9, 7),
                    name: '7',
                    type: PeriodType.Day,
                },
                createdOnProperty: <Period>{
                    date: new Date(2023, 9, 2),
                    name: '2',
                    type: PeriodType.Day,
                },
                name: 'third note',
                path: 'path/to/third-note.md',
                properties: new Map<string, string>(),
            };

            const settings = {
                ...DEFAULT_DISPLAY_NOTES_SETTINGS,
                createdOnDatePropertyName: 'created_on',
                createdOnPropertyFormat: 'yyyy-MM-dd',
                useCreatedOnDateFromProperties: true,
                sortNotes: SortNotes.Ascending,
            };
            when(displayNoteSettingsRepository.get).mockResolvedValue(settings);
            when(noteRepository.getNotes).mockResolvedValue([thirdNote, firstNote, secondNote]);

            // Act
            const result = await manager.getNotesForPeriod(period);

            // Assert
            expect(result).toEqual([thirdNote, secondNote, firstNote]);
        });

        it('should fall back to createdOn sorting when some notes lack createdOnProperty in ascending order', async () => {
            // Arrange
            const noteA = <Note>{
                createdOn: <Period>{
                    date: new Date(2023, 9, 1),
                    name: '1',
                    type: PeriodType.Day,
                },
                createdOnProperty: <Period>{
                    date: new Date(2023, 9, 5),
                    name: '5',
                    type: PeriodType.Day,
                },
                name: 'note A',
                path: 'path/to/note-a.md',
                properties: new Map<string, string>(),
            };
            const noteB = <Note>{
                createdOn: <Period>{
                    date: new Date(2023, 9, 3),
                    name: '3',
                    type: PeriodType.Day,
                },
                createdOnProperty: null,
                name: 'note B',
                path: 'path/to/note-b.md',
                properties: new Map<string, string>(),
            };
            const noteC = <Note>{
                createdOn: <Period>{
                    date: new Date(2023, 9, 2),
                    name: '2',
                    type: PeriodType.Day,
                },
                createdOnProperty: <Period>{
                    date: new Date(2023, 9, 7),
                    name: '7',
                    type: PeriodType.Day,
                },
                name: 'note C',
                path: 'path/to/note-c.md',
                properties: new Map<string, string>(),
            };

            const settings = {
                ...DEFAULT_DISPLAY_NOTES_SETTINGS,
                createdOnDatePropertyName: 'created_on',
                createdOnPropertyFormat: 'yyyy-MM-dd',
                useCreatedOnDateFromProperties: true,
                sortNotes: SortNotes.Ascending,
            };
            when(displayNoteSettingsRepository.get).mockResolvedValue(settings);
            when(noteRepository.getNotes).mockResolvedValue([noteC, noteA, noteB]);

            // Act
            const result = await manager.getNotesForPeriod(period);

            // Assert
            expect(result).toEqual([noteA, noteC, noteB]);
        });

        it('should fall back to createdOn sorting when some notes lack createdOnProperty in descending order', async () => {
            // Arrange
            const noteA = <Note>{
                createdOn: <Period>{
                    date: new Date(2023, 9, 1),
                    name: '1',
                    type: PeriodType.Day,
                },
                createdOnProperty: <Period>{
                    date: new Date(2023, 9, 5),
                    name: '5',
                    type: PeriodType.Day,
                },
                name: 'note A',
                path: 'path/to/note-a.md',
                properties: new Map<string, string>(),
            };
            const noteB = <Note>{
                createdOn: <Period>{
                    date: new Date(2023, 9, 3),
                    name: '3',
                    type: PeriodType.Day,
                },
                createdOnProperty: null,
                name: 'note B',
                path: 'path/to/note-b.md',
                properties: new Map<string, string>(),
            };
            const noteC = <Note>{
                createdOn: <Period>{
                    date: new Date(2023, 9, 2),
                    name: '2',
                    type: PeriodType.Day,
                },
                createdOnProperty: <Period>{
                    date: new Date(2023, 9, 7),
                    name: '7',
                    type: PeriodType.Day,
                },
                name: 'note C',
                path: 'path/to/note-c.md',
                properties: new Map<string, string>(),
            };

            const settings = {
                ...DEFAULT_DISPLAY_NOTES_SETTINGS,
                createdOnDatePropertyName: 'created_on',
                createdOnPropertyFormat: 'yyyy-MM-dd',
                useCreatedOnDateFromProperties: true,
                sortNotes: SortNotes.Descending,
            };
            when(displayNoteSettingsRepository.get).mockResolvedValue(settings);
            when(noteRepository.getNotes).mockResolvedValue([noteC, noteA, noteB]);

            // Act
            const result = await manager.getNotesForPeriod(period);

            // Assert
            expect(result).toEqual([noteB, noteC, noteA]);
        });

        it('should return notes in descending order when all notes have createdOnProperty', async () => {
            // Arrange
            const firstNote = <Note>{
                createdOn: <Period>{
                    date: new Date(2023, 9, 1),
                    name: '1',
                    type: PeriodType.Day,
                },
                createdOnProperty: <Period>{
                    date: new Date(2023, 9, 2),
                    name: '2',
                    type: PeriodType.Day,
                },
                name: 'first note',
                path: 'path/to/first-note.md',
                properties: new Map<string, string>(),
            };
            const secondNote = <Note>{
                createdOn: <Period>{
                    date: new Date(2023, 9, 4),
                    name: '4',
                    type: PeriodType.Day,
                },
                createdOnProperty: <Period>{
                    date: new Date(2023, 9, 3),
                    name: '3',
                    type: PeriodType.Day,
                },
                name: 'second note',
                path: 'path/to/second-note.md',
                properties: new Map<string, string>(),
            };
            const thirdNote = <Note>{
                createdOn: <Period>{
                    date: new Date(2023, 9, 7),
                    name: '7',
                    type: PeriodType.Day,
                },
                createdOnProperty: <Period>{
                    date: new Date(2023, 9, 4),
                    name: '4',
                    type: PeriodType.Day,
                },
                name: 'third note',
                path: 'path/to/third-note.md',
                properties: new Map<string, string>(),
            };

            const settings = {
                ...DEFAULT_DISPLAY_NOTES_SETTINGS,
                createdOnDatePropertyName: 'created_on',
                createdOnPropertyFormat: 'yyyy-MM-dd',
                useCreatedOnDateFromProperties: true,
                sortNotes: SortNotes.Descending,
            };
            when(displayNoteSettingsRepository.get).mockResolvedValue(settings);
            when(noteRepository.getNotes).mockResolvedValue([firstNote, secondNote, thirdNote]);

            // Act
            const result = await manager.getNotesForPeriod(period);

            // Assert
            expect(result).toEqual([thirdNote, secondNote, firstNote]);
        });

        it('should correctly apply descending arithmetic when sorting by createdOnProperty', async () => {
            // Arrange
            const oldestNote = <Note>{
                createdOn: <Period>{
                    date: new Date(2023, 9, 10),
                    name: '10',
                    type: PeriodType.Day,
                },
                createdOnProperty: <Period>{
                    date: new Date(2023, 9, 1),
                    name: '1',
                    type: PeriodType.Day,
                },
                name: 'oldest note',
                path: 'path/to/oldest-note.md',
                properties: new Map<string, string>(),
            };
            const middleNote = <Note>{
                createdOn: <Period>{
                    date: new Date(2023, 9, 10),
                    name: '10',
                    type: PeriodType.Day,
                },
                createdOnProperty: <Period>{
                    date: new Date(2023, 9, 15),
                    name: '15',
                    type: PeriodType.Day,
                },
                name: 'middle note',
                path: 'path/to/middle-note.md',
                properties: new Map<string, string>(),
            };
            const newestNote = <Note>{
                createdOn: <Period>{
                    date: new Date(2023, 9, 10),
                    name: '10',
                    type: PeriodType.Day,
                },
                createdOnProperty: <Period>{
                    date: new Date(2023, 9, 20),
                    name: '20',
                    type: PeriodType.Day,
                },
                name: 'newest note',
                path: 'path/to/newest-note.md',
                properties: new Map<string, string>(),
            };

            const settings = {
                ...DEFAULT_DISPLAY_NOTES_SETTINGS,
                createdOnDatePropertyName: 'created_on',
                createdOnPropertyFormat: 'yyyy-MM-dd',
                useCreatedOnDateFromProperties: true,
                sortNotes: SortNotes.Descending,
            };
            when(displayNoteSettingsRepository.get).mockResolvedValue(settings);
            when(noteRepository.getNotes).mockResolvedValue([oldestNote, newestNote, middleNote]);

            // Act
            const result = await manager.getNotesForPeriod(period);

            // Assert
            expect(result).toEqual([newestNote, middleNote, oldestNote]);
        });

        it('should correctly apply ascending arithmetic when sorting by createdOnProperty with distinct timestamps', async () => {
            // Arrange
            const noteEarly = <Note>{
                createdOn: <Period>{
                    date: new Date(2023, 9, 10),
                    name: '10',
                    type: PeriodType.Day,
                },
                createdOnProperty: <Period>{
                    date: new Date(2023, 9, 5, 8, 30),
                    name: '5',
                    type: PeriodType.Day,
                },
                name: 'early note',
                path: 'path/to/early-note.md',
                properties: new Map<string, string>(),
            };
            const noteLate = <Note>{
                createdOn: <Period>{
                    date: new Date(2023, 9, 10),
                    name: '10',
                    type: PeriodType.Day,
                },
                createdOnProperty: <Period>{
                    date: new Date(2023, 9, 5, 18, 45),
                    name: '5',
                    type: PeriodType.Day,
                },
                name: 'late note',
                path: 'path/to/late-note.md',
                properties: new Map<string, string>(),
            };

            const settings = {
                ...DEFAULT_DISPLAY_NOTES_SETTINGS,
                createdOnDatePropertyName: 'created_on',
                createdOnPropertyFormat: 'yyyy-MM-dd HH:mm',
                useCreatedOnDateFromProperties: true,
                sortNotes: SortNotes.Ascending,
            };
            when(displayNoteSettingsRepository.get).mockResolvedValue(settings);
            when(noteRepository.getNotes).mockResolvedValue([noteLate, noteEarly]);

            // Act
            const result = await manager.getNotesForPeriod(period);

            // Assert
            expect(result).toEqual([noteEarly, noteLate]);
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