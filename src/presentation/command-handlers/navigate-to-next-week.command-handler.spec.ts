import {mockCalendarViewModel} from 'src/test-helpers/view-model.mocks';
import {
    NavigateToNextWeekCommandHandler,
} from 'src/presentation/command-handlers/navigate-to-next-week.command-handler';

describe('NavigateToNextWeekCommandHandler', () => {
    let commandHandler: NavigateToNextWeekCommandHandler;
    let viewModel: typeof mockCalendarViewModel;

    beforeEach(() => {
        viewModel = mockCalendarViewModel;
        commandHandler = new NavigateToNextWeekCommandHandler(viewModel);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('execute', () => {
        it('should call the navigateToNextWeek method on the view model', () => {
            // Arrange
            
            // Act
            commandHandler.execute();

            // Assert
            expect(viewModel.navigateToNextWeek).toHaveBeenCalled();
        });
    });
});