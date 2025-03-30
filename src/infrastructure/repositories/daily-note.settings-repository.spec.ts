import {DailyNoteSettingsRepository} from 'src/infrastructure/repositories/daily-note.settings-repository';
import {mockSettingsAdapter} from 'src/test-helpers/adapter.mocks';
import {DEFAULT_PLUGIN_SETTINGS, PluginSettings} from 'src/domain/settings/plugin.settings';
import {when} from 'jest-when';
import {DEFAULT_WEEKLY_NOTE_SETTINGS} from 'src/domain/settings/period-note.settings';

describe('DailyNoteSettingsRepository', () => {
    let repository: DailyNoteSettingsRepository;
    const settingsAdapter = mockSettingsAdapter;

    beforeEach(() => {
        repository = new DailyNoteSettingsRepository(settingsAdapter);
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
                    ...DEFAULT_WEEKLY_NOTE_SETTINGS,
                    folder: 'changed/setting'
                },
                dailyNotes: {
                    nameTemplate: 'yyyy-MM-dd',
                    folder: 'Daily notes',
                    templateFile: 'Templates/Daily note'
                }
            }
            const updatedSettings = <PluginSettings> {
                ...DEFAULT_PLUGIN_SETTINGS,
                weeklyNotes: {
                    ...DEFAULT_WEEKLY_NOTE_SETTINGS,
                    folder: 'changed/setting'
                },
                dailyNotes: {
                    nameTemplate: 'yyyyMMdd - EEEE',
                    folder: '01 journaling/daily notes',
                    templateFile: '00 templates/daily note.md'
                }
            };

            when(settingsAdapter.getSettings).mockResolvedValue(oldSettings);

            // Act
            await repository.store(updatedSettings.dailyNotes);

            // Assert
            expect(settingsAdapter.storeSettings).toHaveBeenCalledWith(updatedSettings);
        });
    });

    describe('get', () => {
        it('should return the stored settings', async () => {
            // Arrange
            const settings = <PluginSettings> {
                ...DEFAULT_PLUGIN_SETTINGS,
                dailyNotes: {
                    nameTemplate: 'yyyy-MM-dd',
                    folder: 'Daily notes',
                    templateFile: 'Templates/Daily note'
                }
            };

            when(settingsAdapter.getSettings).mockResolvedValue(settings);

            // Act
            const result = await repository.get();

            // Assert
            expect(result).toEqual(settings.dailyNotes);
        });

        it('should return the stored settings and the default settings if the stored settings are incomplete', async () => {
            // Arrange
            const settings = <PluginSettings> {
                ...DEFAULT_PLUGIN_SETTINGS,
                dailyNotes: {
                    nameTemplate: 'yyyy-MM-dd'
                }
            };

            when(settingsAdapter.getSettings).mockResolvedValue(settings);

            // Act
            const result = await repository.get();

            // Assert
            expect(result).toEqual({
                ...DEFAULT_PLUGIN_SETTINGS.dailyNotes,
                nameTemplate: 'yyyy-MM-dd'
            });
        });
    });
});