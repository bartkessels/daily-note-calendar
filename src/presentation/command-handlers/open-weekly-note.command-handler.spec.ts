import {OpenWeeklyNoteCommandHandler} from 'src/presentation/command-handlers/open-weekly-note.command-handler';
import {mockGeneralSettingsRepository} from 'src/test-helpers/repository.mocks';
import {mockDateManager} from 'src/test-helpers/manager.mocks';
import {mockCalendarViewModel} from 'src/test-helpers/view-model.mocks';
import {mockDateManagerFactory, mockSettingsRepositoryFactory} from 'src/test-helpers/factory.mocks';
import {Period, PeriodType} from 'src/domain/models/period.model';
import {when} from 'jest-when';
import {DEFAULT_GENERAL_SETTINGS} from 'src/domain/settings/general.settings';
import {WeekModel} from 'src/domain/models/week.model';
import {ModifierKey} from 'src/presentation/models/modifier-key';
import {weekUiModel} from 'src/presentation/models/week.ui-model';

describe('OpenWeeklyNoteCommandHandler', () => {
    let commandHandler: OpenWeeklyNoteCommandHandler;

    const settingsRepository = mockGeneralSettingsRepository;
    const dateManager = mockDateManager;
    const viewModel = mockCalendarViewModel;

    beforeEach(() => {
        const dateManagerFactory = mockDateManagerFactory(dateManager);
        const settingsRepositoryFactory = mockSettingsRepositoryFactory(settingsRepository);

        when(settingsRepository.get).mockResolvedValue(DEFAULT_GENERAL_SETTINGS);

        commandHandler = new OpenWeeklyNoteCommandHandler(dateManagerFactory, settingsRepositoryFactory, viewModel);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('execute', () => {
        const today = <Period>{
            date: new Date(2023, 9, 2),
            name: '02',
            type: PeriodType.Day
        };

        const week = <WeekModel> {
            date: new Date(2023, 9, 2),
            name: '40',
            weekNumber: 40,
            year: <Period> {
                date: new Date(2023, 0),
                name: '2023',
                type: PeriodType.Year
            },
            month: <Period> {
                date: new Date(2023, 9),
                name: 'October',
                type: PeriodType.Month
            },
            type: PeriodType.Week,
            days: []
        };


        it('should get the current week based on the current day from the date manager', async () => {
            // Arrange
            when(dateManager.getCurrentDay).mockReturnValue(today);
            when(dateManager.getWeek).calledWith(today, DEFAULT_GENERAL_SETTINGS.firstDayOfWeek).mockReturnValue(week);

            // Act
            await commandHandler.execute();

            // Assert
            expect(dateManager.getWeek).toHaveBeenCalledWith(today, DEFAULT_GENERAL_SETTINGS.firstDayOfWeek);
        });

        it('should call the openWeeklyNote method of the view model with the current week and None modifier key', async () => {
            // Arrange
            when(dateManager.getCurrentDay).mockReturnValue(today);
            when(dateManager.getWeek).calledWith(today, DEFAULT_GENERAL_SETTINGS.firstDayOfWeek).mockReturnValue(week);

            // Act
            await commandHandler.execute();

            // Assert
            expect(viewModel.openWeeklyNote).toHaveBeenCalledWith(ModifierKey.None, weekUiModel(week));
        });
    });
});