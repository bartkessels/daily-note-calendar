import {mockSettingsAdapter} from 'src/test-helpers/adapter.mocks';
import {DEFAULT_PLUGIN_SETTINGS, PluginSettings} from 'src/domain/settings/plugin.settings';
import {when} from 'jest-when';
import {WeeklyNoteSettingsRepository} from 'src/infrastructure/repositories/weekly-note.settings-repository';

describe('WeeklyNoteSettingsRepository', () => {
    let repository: WeeklyNoteSettingsRepository;
    const settingsAdapter = mockSettingsAdapter;

    beforeEach(() => {
        repository = new WeeklyNoteSettingsRepository(settingsAdapter);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('store', () => {
        it('should store the settings', async () => {
            // Arrange
            const oldSettings = <PluginSettings> {
                ...DEFAULT_PLUGIN_SETTINGS,
                weeklyNotes: {
                    nameTemplate: 'yyyy-ww',
                    folder: 'Weekly notes',
                    templateFile: 'Templates/Weekly note'
                }
            }
            const updatedSettings = <PluginSettings> {
                ...DEFAULT_PLUGIN_SETTINGS,
                weeklyNotes: {
                    nameTemplate: 'yyyy - ww',
                    folder: '01 journaling/weekly notes',
                    templateFile: '00 templates/weekly note.md'
                }
            };

            when(settingsAdapter.getSettings).mockResolvedValue(oldSettings);

            // Act
            await repository.store(updatedSettings.weeklyNotes);

            // Assert
            expect(settingsAdapter.storeSettings).toHaveBeenCalledWith(updatedSettings);
        });
    });

    describe('get', () => {
        it('should return the stored settings', async () => {
            // Arrange
            const settings = <PluginSettings> {
                ...DEFAULT_PLUGIN_SETTINGS,
                weeklyNotes: {
                    nameTemplate: 'yyyy-ww',
                    folder: 'Weekly notes',
                    templateFile: 'Templates/Weekly note'
                }
            };

            when(settingsAdapter.getSettings).mockResolvedValue(settings);

            // Act
            const result = await repository.get();

            // Assert
            expect(result).toEqual(settings.weeklyNotes);
        });

        it('should return the stored settings and the default settings if the stored settings are incomplete', async () => {
            // Arrange
            const settings = <PluginSettings> {
                ...DEFAULT_PLUGIN_SETTINGS,
                weeklyNotes: {
                    nameTemplate: 'yyyy-ww',
                }
            };

            when(settingsAdapter.getSettings).mockResolvedValue(settings);

            // Act
            const result = await repository.get();

            // Assert
            expect(result).toEqual({
                ...DEFAULT_PLUGIN_SETTINGS.weeklyNotes,
                nameTemplate: 'yyyy-ww',
            });
        });
    });
});