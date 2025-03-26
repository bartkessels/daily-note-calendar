import {AdapterNoteRepository} from 'src/infrastructure/repositories/adapter.note-repository';
import {mockNoteAdapter} from 'src/test-helpers/adapter.mocks';
import {mockNoteWithCreatedOnProperty} from 'src/test-helpers/model.mocks';
import {Note} from 'src/domain/models/note.model';
import {Period, PeriodType} from 'src/domain/models/period.model';
import {mockDateParser} from 'src/test-helpers/parser.mocks';
import {mockDisplayNoteSettingsRepository} from 'src/test-helpers/repository.mocks';
import {mockDateParserFactory, mockSettingsRepositoryFactory} from 'src/test-helpers/factory.mocks';
import {DEFAULT_DISPLAY_NOTES_SETTINGS, DisplayNotesSettings} from 'src/domain/settings/display-notes.settings';
import {when} from 'jest-when';

describe('AdapterNoteRepository', () => {
    let repository: AdapterNoteRepository;
    const noteAdapter = mockNoteAdapter;
    const dateParser = mockDateParser;
    const settingsRepository = mockDisplayNoteSettingsRepository;

    beforeEach(() => {
        const dateParserFactory = mockDateParserFactory(dateParser);
        const settingsRepositoryFactory = mockSettingsRepositoryFactory(settingsRepository);

        repository = new AdapterNoteRepository(noteAdapter, dateParserFactory, settingsRepositoryFactory);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('getActiveNote', () => {
        it('should return the active note when the adapter returns it', async () => {
            // Arrange
            const note = mockNoteWithCreatedOnProperty;
            noteAdapter.getActiveNote.mockResolvedValue(note);

            // Act
            const result = await repository.getActiveNote();

            // Assert
            expect(result).toBe(note);
        });

        it('should return null when the adapter returns null', async () => {
            // Arrange
            noteAdapter.getActiveNote.mockResolvedValue(null);

            // Act
            const result = await repository.getActiveNote();

            // Assert
            expect(result).toBeNull();
        });

        it('should set the createdOnProperty when the properties contain a valid date property', async () => {
            // Arrange
            const settings = <DisplayNotesSettings> { ...DEFAULT_DISPLAY_NOTES_SETTINGS, createdOnDatePropertyName: 'created_on', createdOnPropertyFormat: 'dd-MM-yyyy' };

            const properties = new Map<string, string>();
            properties.set(settings.createdOnPropertyFormat, '02-10-2023');

            const note = <Note> {
                createdOn: <Period> {
                    date: new Date(3, 9, 2023),
                    name: '03',
                    type: PeriodType.Day
                },
                name: 'My note with a property',
                path: 'path/to/note.md',
                properties: properties
            };

            when(noteAdapter.getActiveNote).mockResolvedValue(note);

            // Act
            const result = await repository.getActiveNote();

            // Assert
            expect(result).not.toBeNull();
            expect(result?.createdOnProperty).not.toBeNull();
            expect(result?.createdOnProperty?.date).toEqual(new Date(2, 9, 2023));
            expect(result?.createdOnProperty?.name).toEqual('02');
            expect(result?.createdOnProperty?.type).toEqual(PeriodType.Day);
        });
    });

    describe('getNotes', () => {
        const firstNote = <Note>{
            createdOn: <Period> {
                date: new Date(2023, 9, 2),
                name: '2',
                type: PeriodType.Day
            },
            name: 'First note',
            path: 'path/to/first-note.md',
            properties: new Map<string, string>()
        };
        const secondNote = <Note>{
            createdOn: <Period> {
                date: new Date(2023, 9, 3),
                name: '3',
                type: PeriodType.Day
            },
            name: 'Second note',
            path: 'path/to/second-note.md',
            properties: new Map<string, string>()
        };
        const thirdNote = <Note>{
            createdOn: <Period> {
                date: new Date(2023, 9, 3),
                name: '3',
                type: PeriodType.Day
            },
            name: 'Third note',
            path: 'path/to/third-note.md',
            properties: new Map<string, string>()
        };

        it('should return the notes that match the filter', async () => {
            // Arrange
            noteAdapter.getNotes.mockResolvedValue([firstNote, secondNote, thirdNote]);
            const filter = (note: Note) => note.createdOn.date.getDate() === firstNote.createdOn.date.getDate();

            // Act
            const result = await repository.getNotes(filter);

            // Assert
            expect(result).toEqual([firstNote]);
        });

        it('should return all notes if the filter is always true', async () => {
            // Arrange
            noteAdapter.getNotes.mockResolvedValue([firstNote, secondNote, thirdNote]);
            const filter = (note: Note) => true;

            // Act
            const result = await repository.getNotes(filter);

            // Assert
            expect(result).toEqual([firstNote, secondNote, thirdNote]);
        });

        it('should return an empty list when the filter is always false', async () => {
            // Arrange
            noteAdapter.getNotes.mockResolvedValue([firstNote, secondNote, thirdNote]);
            const filter = (note: Note) => false;

            // Act
            const result = await repository.getNotes(filter);

            // Assert
            expect(result).toEqual([]);
        });

        it('should return an empty list when the adapter returns an empty list', async () => {
            // Arrange
            noteAdapter.getNotes.mockResolvedValue([]);
            const filter = (note: Note) => true;

            // Act
            const result = await repository.getNotes(filter);

            // Assert
            expect(result).toEqual([]);
        });
    });
});