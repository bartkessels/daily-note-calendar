import {mockSettingsAdapter} from 'src/test-helpers/adapter.mocks';
import {DEFAULT_PLUGIN_SETTINGS, PluginSettings} from 'src/domain/settings/plugin.settings';
import {when} from 'jest-when';
import {GeneralSettingsRepository} from 'src/infrastructure/repositories/general.settings-repository';
import {DayOfWeek, WeekNumberStandard} from 'src/domain/models/week';
import {DEFAULT_WEEKLY_NOTE_SETTINGS} from 'src/domain/settings/period-note.settings';

describe('GeneralSettingsRepository', () => {
    let repository: GeneralSettingsRepository;
    const settingsAdapter = mockSettingsAdapter;

    beforeEach(() => {
        repository = new GeneralSettingsRepository(settingsAdapter);
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
                generalSettings: {
                    displayNotesCreatedOnDate: false,
                    displayNoteIndicator: true,
                    useModifierKeyToCreateNote: false,
                    firstDayOfWeek: DayOfWeek.Monday
                }
            }
            const updatedSettings = <PluginSettings>{
                ...DEFAULT_PLUGIN_SETTINGS,
                weeklyNotes: {
                    ...DEFAULT_WEEKLY_NOTE_SETTINGS,
                    folder: 'changed/setting'
                },
                generalSettings: {
                    displayNotesCreatedOnDate: true,
                    displayNoteIndicator: false,
                    useModifierKeyToCreateNote: true,
                    firstDayOfWeek: DayOfWeek.Sunday
                }
            };

            when(settingsAdapter.getSettings).mockResolvedValue(oldSettings);

            // Act
            await repository.store(updatedSettings.generalSettings);

            // Assert
            expect(settingsAdapter.storeSettings).toHaveBeenCalledWith(updatedSettings);
        });
    });

    describe('get', () => {
        it('should return the stored settings', async () => {
            // Arrange
            const settings = <PluginSettings>{
                ...DEFAULT_PLUGIN_SETTINGS,
                generalSettings: {
                    displayNotesCreatedOnDate: false,
                    displayNoteIndicator: true,
                    useModifierKeyToCreateNote: false,
                    firstDayOfWeek: DayOfWeek.Monday,
                    weekNumberStandard: WeekNumberStandard.ISO
                }
            };

            when(settingsAdapter.getSettings).mockResolvedValue(settings);

            // Act
            const result = await repository.get();

            // Assert
            expect(result).toEqual(settings.generalSettings);
        });

        it('should return the stored settings and the default settings if the stored settings are incomplete', async () => {
            // Arrange
            const settings = <PluginSettings>{
                ...DEFAULT_PLUGIN_SETTINGS,
                generalSettings: {
                    displayNotesCreatedOnDate: true,
                }
            };

            when(settingsAdapter.getSettings).mockResolvedValue(settings);

            // Act
            const result = await repository.get();

            // Assert
            expect(result).toEqual({
                ...DEFAULT_PLUGIN_SETTINGS.generalSettings,
                displayNotesCreatedOnDate: true,
            });
        });
    });
});