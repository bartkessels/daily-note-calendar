import {mockSettingsAdapter} from 'src/test-helpers/adapter.mocks';
import {DEFAULT_PLUGIN_SETTINGS, PluginSettings} from 'src/domain/settings/plugin.settings';
import {when} from 'jest-when';
import {MonthlyNoteSettingsRepository} from 'src/infrastructure/repositories/monthly-note.settings-repository';

describe('MonthlyNoteSettingsRepository', () => {
    let repository: MonthlyNoteSettingsRepository;
    const settingsAdapter = mockSettingsAdapter;

    beforeEach(() => {
        repository = new MonthlyNoteSettingsRepository(settingsAdapter);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('store', () => {
        it('should store the settings', async () => {
            // Arrange
            const oldSettings = <PluginSettings> {
                ...DEFAULT_PLUGIN_SETTINGS,
                monthlyNotes: {
                    nameTemplate: 'yyyy-MM',
                    folder: 'Monthly notes',
                    templateFile: 'Templates/Monthly note'
                }
            }
            const updatedSettings = <PluginSettings> {
                ...DEFAULT_PLUGIN_SETTINGS,
                monthlyNotes: {
                    nameTemplate: 'yyyy - MMMM',
                    folder: '01 journaling/monthly notes',
                    templateFile: '00 templates/monthly note.md'
                }
            };

            when(settingsAdapter.getSettings).mockResolvedValue(oldSettings);

            // Act
            await repository.store(updatedSettings.monthlyNotes);

            // Assert
            expect(settingsAdapter.storeSettings).toHaveBeenCalledWith(updatedSettings);
        });
    });

    describe('get', () => {
        it('should return the stored settings', async () => {
            // Arrange
            const settings = <PluginSettings> {
                ...DEFAULT_PLUGIN_SETTINGS,
                monthlyNotes: {
                    nameTemplate: 'yyyy-MM',
                    folder: 'Monthly notes',
                    templateFile: 'Templates/Monthly note'
                }
            };

            when(settingsAdapter.getSettings).mockResolvedValue(settings);

            // Act
            const result = await repository.get();

            // Assert
            expect(result).toEqual(settings.monthlyNotes);
        });

        it('should return the stored settings and the default settings if the stored settings are incomplete', async () => {
            // Arrange
            const settings = <PluginSettings> {
                ...DEFAULT_PLUGIN_SETTINGS,
                monthlyNotes: {
                    nameTemplate: 'yyyy-MM',
                }
            };

            when(settingsAdapter.getSettings).mockResolvedValue(settings);

            // Act
            const result = await repository.get();

            // Assert
            expect(result).toEqual({
                ...DEFAULT_PLUGIN_SETTINGS.monthlyNotes,
                nameTemplate: 'yyyy-MM',
            });
        });
    });
});