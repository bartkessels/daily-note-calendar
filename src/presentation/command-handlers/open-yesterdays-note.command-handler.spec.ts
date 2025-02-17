import {mockDateManager} from 'src/test-helpers/manager.mocks';
import {mockCalendarViewModel} from 'src/test-helpers/view-model.mocks';
import {mockDateManagerFactory} from 'src/test-helpers/factory.mocks';
import {Period, PeriodType} from 'src/domain/models/period.model';
import {when} from 'jest-when';
import {ModifierKey} from 'src/presentation/models/modifier-key';
import {PeriodUiModel} from 'src/presentation/models/period.ui-model';
import {OpenYesterdaysNoteCommandHandler} from 'src/presentation/command-handlers/open-yesterdays-note.command-handler';

describe('OpenYesterdaysNoteCommandHandler', () => {
    let commandHandler: OpenYesterdaysNoteCommandHandler;
    const dateManager = mockDateManager;
    const viewModel = mockCalendarViewModel;

    beforeEach(() => {
        const dateManagerFactory = mockDateManagerFactory(dateManager);
        commandHandler = new OpenYesterdaysNoteCommandHandler(dateManagerFactory, viewModel);
    });

    describe('execute', () => {
        it('should call the openDailyNote method on the view model with the period from the date manager', async () => {
            // Arrange
            const expectedPeriod = <Period> {
                name: '03',
                date: new Date(2023, 9, 3),
                type: PeriodType.Day
            };
            const expectedPeriodUiModel = <PeriodUiModel> {
                period: expectedPeriod,
                hasPeriodNote: false,
                noNotes: 0
            };

            when(dateManager.getYesterday).mockReturnValue(expectedPeriod);

            // Act
            await commandHandler.execute();

            // Assert
            expect(dateManager.getYesterday).toHaveBeenCalled();
            expect(viewModel.openDailyNote).toHaveBeenCalledWith(ModifierKey.None, expectedPeriodUiModel);
        });
    });
});