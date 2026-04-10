import {DisplayInCalendarCommandHandler} from 'src/presentation/command-handlers/display-in-calendar.command-handler';
import { mockNoteManager } from 'src/test-helpers/manager.mocks';
import {mockDisplayNoteSettingsRepository} from 'src/test-helpers/repository.mocks';
import {mockNoteManagerFactory, mockSettingsRepositoryFactory} from 'src/test-helpers/factory.mocks';
import {DEFAULT_DISPLAY_NOTES_SETTINGS, DisplayNotesSettings} from 'src/domain/settings/display-notes.settings';
import {mockCalendarViewModel} from 'src/test-helpers/view-model.mocks';
import {Note} from 'src/domain/models/note.model';
import {Period, PeriodType} from 'src/domain/models/period.model';

describe('DisplayInCalendarCommandHandler', () => {
    let commandHandler: DisplayInCalendarCommandHandler;
    let noteManager: typeof mockNoteManager;
    let settingsRepository: typeof mockDisplayNoteSettingsRepository;
    let viewModel: typeof mockCalendarViewModel;
    let activeNote: Note;

    beforeEach(() => {
        noteManager = mockNoteManager;
        settingsRepository = mockDisplayNoteSettingsRepository;
        viewModel = mockCalendarViewModel;
        activeNote = <Note> {
            createdOn: <Period> {
                name: '03',
                date: new Date(2023, 9, 3),
                type: PeriodType.Day,
            },
            createdOnProperty: <Period> {
                name: '02',
                date: new Date(2023, 9, 2),
                type: PeriodType.Day,
            },
            name: 'My Note',
            path: 'path/to/note',
            properties: new Map<string, string>(),
        };


        const noteManagerFactory = mockNoteManagerFactory(noteManager);
        const settingsRepositoryFactory = mockSettingsRepositoryFactory<DisplayNotesSettings>(settingsRepository);

        commandHandler = new DisplayInCalendarCommandHandler(noteManagerFactory, settingsRepositoryFactory, viewModel);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('execute', () => {
        it('should not call setSelectedPeriod when there is no active note', async () => {
            // Arrange
            const settings = <DisplayNotesSettings> {
                ...DEFAULT_DISPLAY_NOTES_SETTINGS,
                useCreatedOnDateFromProperties: true,
            };

            settingsRepository.get.mockResolvedValue(settings);
            noteManager.getActiveNote.mockResolvedValue(null);

            // Act
            await commandHandler.execute();

            // Assert
            expect(noteManager.getActiveNote).toHaveBeenCalled();
            expect(viewModel.setSelectedPeriod).not.toHaveBeenCalled();
        });

        it('should select the period based on the createdOnProperty if useCreatedOnDateFromProperties is true', async () => {
            // Arrange
            const settings = <DisplayNotesSettings> {
                ...DEFAULT_DISPLAY_NOTES_SETTINGS,
                useCreatedOnDateFromProperties: true,
            };

            settingsRepository.get.mockResolvedValue(settings);
            noteManager.getActiveNote.mockResolvedValue(activeNote);

            // Act
            await commandHandler.execute();

            // Assert
            expect(noteManager.getActiveNote).toHaveBeenCalled();
            expect(viewModel.setSelectedPeriod).toHaveBeenCalledWith(activeNote.createdOnProperty);
        });

        it('should not select any period if useCreatedOnDateFromProperties is true but there is no createdOnProperty', async () => {
            // Arrange
            const settings = <DisplayNotesSettings> {
                ...DEFAULT_DISPLAY_NOTES_SETTINGS,
                useCreatedOnDateFromProperties: true,
            };
            const activeNoteWithoutCreatedOnProperty = <Note>{ ...activeNote, createdOnProperty: null };

            settingsRepository.get.mockResolvedValue(settings);
            noteManager.getActiveNote.mockResolvedValue(activeNoteWithoutCreatedOnProperty);

            // Act
            await commandHandler.execute();

            // Assert
            expect(noteManager.getActiveNote).toHaveBeenCalled();
            expect(viewModel.setSelectedPeriod).not.toHaveBeenCalled();
        });

        it('should select the period based on the createdOn if useCreatedOnDateFromProperties is false', async () => {
            // Arrange
            const settings = <DisplayNotesSettings> {
                ...DEFAULT_DISPLAY_NOTES_SETTINGS,
                useCreatedOnDateFromProperties: false,
            };

            settingsRepository.get.mockResolvedValue(settings);
            noteManager.getActiveNote.mockResolvedValue(activeNote);

            // Act
            await commandHandler.execute();

            // Assert
            expect(noteManager.getActiveNote).toHaveBeenCalled();
            expect(viewModel.setSelectedPeriod).toHaveBeenCalledWith(activeNote.createdOn);
        });
    });
});