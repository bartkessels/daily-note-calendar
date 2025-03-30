import {mockSettingsAdapter} from 'src/test-helpers/adapter.mocks';
import {DEFAULT_PLUGIN_SETTINGS} from 'src/domain/settings/plugin.settings';
import {PluginSettingsRepository} from 'src/infrastructure/repositories/plugin.settings-repository';

describe('PluginSettingsRepository', () => {
    let repository: PluginSettingsRepository;
    const settingsAdapter = mockSettingsAdapter;

    beforeEach(() => {
        repository = new PluginSettingsRepository(settingsAdapter);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('store', () => {
        it('should call the adapter with the settings directly', async () => {
            // Arrange
            const settings = DEFAULT_PLUGIN_SETTINGS;

            // Act
            await repository.store(settings);

            // Assert
            expect(settingsAdapter.storeSettings).toHaveBeenCalledWith(settings);
        });
    });

    describe('get', () => {
        it('should call the adapter to get the settings', async () => {
            // Act
            await repository.get();

            // Assert
            expect(settingsAdapter.getSettings).toHaveBeenCalled();
        });
    });
});