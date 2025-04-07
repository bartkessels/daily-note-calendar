import {mockDateManager} from 'src/test-helpers/manager.mocks';
import {DefaultCalendarService} from 'src/presentation/services/default.calendar-service';
import {mockDateManagerFactory} from 'src/test-helpers/factory.mocks';
import {DEFAULT_PLUGIN_SETTINGS} from 'src/domain/settings/plugin.settings';
import {when} from 'jest-when';

describe('DefaultCalendarService', () => {
    const dateManager = mockDateManager;

    let service: DefaultCalendarService;

    beforeEach(() => {
        const dateManagerFactory = mockDateManagerFactory(dateManager);

        service = new DefaultCalendarService(dateManagerFactory);

        when(dateManager.getPreviousWeeks).mockReturnValue([]);
        when(dateManager.getNextWeeks).mockReturnValue([]);
        when(dateManager.getPreviousMonth).mockReturnValue([]);
        when(dateManager.getNextMonth).mockReturnValue([]);
    });

    describe('getCurrentWeek', () => {
        it('should use the default settings for the firstDayOfWeek and weekNumberStandard if the initialize method has not been called', async () => {
            // Arrange
            const settings = DEFAULT_PLUGIN_SETTINGS;

            // Act
            const result = service.getCurrentWeek();

            // Assert
            expect(dateManager.getCurrentWeek).toHaveBeenCalledWith(expect.any, settings.generalSettings.firstDayOfWeek, settings.generalSettings.weekNumberStandard);
        });

        it('should use the custom settings for the firstDayOfWeek and weekNumberStandard if the initialize method has been called', async () => {

        });
        
        it('should get the previous two weeks from the date manager', async () => {
            
        });
        
        it('should get the next to weeks from the date manager', async () => {
            
        });
        
        it('should return the weeks sorted based on the week number', async () => {
            
        });
    })
});