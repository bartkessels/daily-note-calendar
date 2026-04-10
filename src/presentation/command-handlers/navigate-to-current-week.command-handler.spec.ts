import {
    NavigateToCurrentWeekCommandHandler,
} from 'src/presentation/command-handlers/navigate-to-current-week.command-handler';
import {mockCalendarViewModel} from 'src/test-helpers/view-model.mocks';

describe('NavigateToCurrentWeekCommandHandler', () => {
    let commandHandler: NavigateToCurrentWeekCommandHandler;
    let viewModel: typeof mockCalendarViewModel;

    beforeEach(() => {
        viewModel = mockCalendarViewModel;
        commandHandler = new NavigateToCurrentWeekCommandHandler(viewModel);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('execute', () => {
        it('should call the loadCurrentWeek method on the view model', () => {
            // Arrange
            
            // Act
            commandHandler.execute();

            // Assert
            expect(viewModel.navigateToCurrentWeek).toHaveBeenCalled();
        });
    });
});