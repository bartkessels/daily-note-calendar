import {mockSettingsAdapter} from 'src/test-helpers/adapter.mocks';
import {DEFAULT_PLUGIN_SETTINGS, PluginSettings} from 'src/domain/settings/plugin.settings';
import {when} from 'jest-when';
import {QuarterlyNoteSettingsRepository} from 'src/infrastructure/repositories/quarterly-note.settings-repository';

describe('QuarterlyNoteSettingsRepository', () => {
    let repository: QuarterlyNoteSettingsRepository;
    const settingsAdapter = mockSettingsAdapter;

    beforeEach(() => {
        repository = new QuarterlyNoteSettingsRepository(settingsAdapter);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('store', () => {
        it('should store the settings', async () => {
            // Arrange
            const oldSettings = <PluginSettings>{
                ...DEFAULT_PLUGIN_SETTINGS,
                quarterlyNotes: {
                    nameTemplate: 'yyyy-qqq',
                    folder: 'Quarterly notes',
                    templateFile: 'Templates/Quarterly note'
                }
            }
            const updatedSettings = <PluginSettings>{
                ...DEFAULT_PLUGIN_SETTINGS,
                quarterlyNotes: {
                    nameTemplate: 'yyyy - qqq',
                    folder: '01 journaling/quarterly notes',
                    templateFile: '00 templates/quarterly note.md'
                }
            };

            when(settingsAdapter.getSettings).mockResolvedValue(oldSettings);

            // Act
            await repository.store(updatedSettings.quarterlyNotes);

            // Assert
            expect(settingsAdapter.storeSettings).toHaveBeenCalledWith(updatedSettings);
        });
    });

    describe('get', () => {
        it('should return the stored settings', async () => {
            // Arrange
            const settings = <PluginSettings>{
                ...DEFAULT_PLUGIN_SETTINGS,
                quarterlyNotes: {
                    nameTemplate: 'yyyy-qqq',
                    folder: 'Quarterly notes',
                    templateFile: 'Templates/Quarterly note'
                }
            };

            when(settingsAdapter.getSettings).mockResolvedValue(settings);

            // Act
            const result = await repository.get();

            // Assert
            expect(result).toEqual(settings.quarterlyNotes);
        });

        it('should return the stored settings and the default settings if the stored settings are incomplete', async () => {
            // Arrange
            const settings = <PluginSettings>{
                ...DEFAULT_PLUGIN_SETTINGS,
                quarterlyNotes: {
                    nameTemplate: 'yyyy-qqq',
                }
            };

            when(settingsAdapter.getSettings).mockResolvedValue(settings);

            // Act
            const result = await repository.get();

            // Assert
            expect(result).toEqual({
                ...DEFAULT_PLUGIN_SETTINGS.quarterlyNotes,
                nameTemplate: 'yyyy-qqq',
            });
        });
    });
});