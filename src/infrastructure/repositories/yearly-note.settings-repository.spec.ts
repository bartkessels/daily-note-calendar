import {mockSettingsAdapter} from 'src/test-helpers/adapter.mocks';
import {DEFAULT_PLUGIN_SETTINGS, PluginSettings} from 'src/domain/settings/plugin.settings';
import {when} from 'jest-when';
import {YearlyNoteSettingsRepository} from 'src/infrastructure/repositories/yearly-note.settings-repository';

describe('YearlyNoteSettingsRepository', () => {
    let repository: YearlyNoteSettingsRepository;
    const settingsAdapter = mockSettingsAdapter;

    beforeEach(() => {
        repository = new YearlyNoteSettingsRepository(settingsAdapter);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('store', () => {
        it('should store the settings', async () => {
            // Arrange
            const oldSettings = <PluginSettings> {
                ...DEFAULT_PLUGIN_SETTINGS,
                yearlyNotes: {
                    nameTemplate: 'yyyy',
                    folder: 'Yearly notes',
                    templateFile: 'Templates/Yearly note'
                }
            }
            const updatedSettings = <PluginSettings> {
                ...DEFAULT_PLUGIN_SETTINGS,
                yearlyNotes: {
                    nameTemplate: 'yyyy - qqq',
                    folder: '01 journaling/yearly notes',
                    templateFile: '00 templates/yearly note.md'
                }
            };

            when(settingsAdapter.getSettings).mockResolvedValue(oldSettings);

            // Act
            await repository.store(updatedSettings.yearlyNotes);

            // Assert
            expect(settingsAdapter.storeSettings).toHaveBeenCalledWith(updatedSettings);
        });
    });

    describe('get', () => {
        it('should return the stored settings', async () => {
            // Arrange
            const settings = <PluginSettings> {
                ...DEFAULT_PLUGIN_SETTINGS,
                yearlyNotes: {
                    nameTemplate: 'yyyy',
                    folder: 'Yearly notes',
                    templateFile: 'Templates/Yearly note'
                }
            };

            when(settingsAdapter.getSettings).mockResolvedValue(settings);

            // Act
            const result = await repository.get();

            // Assert
            expect(result).toEqual(settings.yearlyNotes);
        });

        it('should return the stored settings and the default settings if the stored settings are incomplete', async () => {
            // Arrange
            const settings = <PluginSettings> {
                ...DEFAULT_PLUGIN_SETTINGS,
                yearlyNotes: {
                    nameTemplate: 'yyyy',
                }
            };

            when(settingsAdapter.getSettings).mockResolvedValue(settings);

            // Act
            const result = await repository.get();

            // Assert
            expect(result).toEqual({
                ...DEFAULT_PLUGIN_SETTINGS.yearlyNotes,
                nameTemplate: 'yyyy',
            });
        });
    });
});