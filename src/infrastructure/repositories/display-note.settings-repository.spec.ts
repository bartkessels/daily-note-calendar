import {mockSettingsAdapter} from 'src/test-helpers/adapter.mocks';
import {DEFAULT_PLUGIN_SETTINGS, PluginSettings} from 'src/domain/settings/plugin.settings';
import {when} from 'jest-when';
import {DisplayNotesSettingsRepository} from 'src/infrastructure/repositories/display-notes.settings-repository';
import {DEFAULT_WEEKLY_NOTE_SETTINGS} from 'src/domain/settings/period-note.settings';

describe('DisplayNotesSettingsRepository', () => {
    let repository: DisplayNotesSettingsRepository;
    const settingsAdapter = mockSettingsAdapter;

    beforeEach(() => {
        repository = new DisplayNotesSettingsRepository(settingsAdapter);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('store', () => {
        it('should store the settings', async () => {
            // Arrange
            const oldSettings = <PluginSettings>{
                ...DEFAULT_PLUGIN_SETTINGS,
                weeklyNotes: {
                    ...DEFAULT_WEEKLY_NOTE_SETTINGS,
                    folder: 'changed/setting'
                },
                notesSettings: {
                    displayDateTemplate: 'yyyy-MM-dd',
                    useCreatedOnDateFromProperties: false,
                    createdOnDatePropertyName: 'createdOn',
                    createdOnPropertyFormat: 'yyyyMMdd'
                }
            }
            const updatedSettings = <PluginSettings>{
                ...DEFAULT_PLUGIN_SETTINGS,
                weeklyNotes: {
                    ...DEFAULT_WEEKLY_NOTE_SETTINGS,
                    folder: 'changed/setting'
                },
                notesSettings: {
                    displayDateTemplate: 'yyyyMMdd',
                    useCreatedOnDateFromProperties: true,
                    createdOnDatePropertyName: 'created',
                    createdOnPropertyFormat: 'yyyy-MM-dd'
                }
            };

            when(settingsAdapter.getSettings).mockResolvedValue(oldSettings);

            // Act
            await repository.store(updatedSettings.notesSettings);

            // Assert
            expect(settingsAdapter.storeSettings).toHaveBeenCalledWith(updatedSettings);
        });
    });

    describe('get', () => {
        it('should return the stored settings', async () => {
            // Arrange
            const settings = <PluginSettings>{
                ...DEFAULT_PLUGIN_SETTINGS,
                notesSettings: {
                    displayDateTemplate: 'yyyy-MM-dd',
                    useCreatedOnDateFromProperties: false,
                    createdOnDatePropertyName: 'createdOn',
                    createdOnPropertyFormat: 'yyyyMMdd'
                }
            };

            when(settingsAdapter.getSettings).mockResolvedValue(settings);

            // Act
            const result = await repository.get();

            // Assert
            expect(result).toEqual(settings.notesSettings);
        });

        it('should return the stored settings and the default settings if the stored settings are incomplete', async () => {
            // Arrange
            const settings = <PluginSettings>{
                ...DEFAULT_PLUGIN_SETTINGS,
                notesSettings: {
                    createdOnDatePropertyName: 'created',
                }
            };

            when(settingsAdapter.getSettings).mockResolvedValue(settings);

            // Act
            const result = await repository.get();

            // Assert
            expect(result).toEqual({
                ...DEFAULT_PLUGIN_SETTINGS.notesSettings,
                createdOnDatePropertyName: 'created',
            });
        });
    });
});