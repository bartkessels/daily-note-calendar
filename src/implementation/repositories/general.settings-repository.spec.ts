import {SettingsAdapter} from 'src/domain/adapters/settings.adapter';
import {DEFAULT_DAILY_NOTE_CALENDAR_SETTINGS} from 'src/domain/models/settings/daily-note-calendar.settings';
import {GeneralSettingsRepository} from 'src/implementation/repositories/general.settings-repository';
import {GeneralSettings} from 'src/domain/models/settings/general.settings';
import {DayOfWeek} from 'src/domain/models/day';

describe('GeneralNoteSettingsRepository', () => {
    let settingsAdapter: jest.Mocked<SettingsAdapter>;
    let repository: GeneralSettingsRepository;

    beforeEach(() => {
        settingsAdapter = {
            getSettings: jest.fn(),
            storeSettings: jest.fn(),
        } as jest.Mocked<SettingsAdapter>;

        repository = new GeneralSettingsRepository(settingsAdapter);
    });

    it('should get general settings', async () => {
        const mockSettings = { ...DEFAULT_DAILY_NOTE_CALENDAR_SETTINGS, generalSettings: {
            displayNotesCreatedOnDate: false,
                displayNoteIndicator: true,
                useModifierKeyToCreateNote: true,
                firstDayOfWeek: DayOfWeek.Monday
        }};
        settingsAdapter.getSettings.mockResolvedValueOnce(mockSettings);

        const settings = await repository.getSettings();

        expect(settingsAdapter.getSettings).toHaveBeenCalledWith(DEFAULT_DAILY_NOTE_CALENDAR_SETTINGS);
        expect(settings).toEqual(mockSettings.generalSettings);
    });

    it('should store general settings', async () => {
        const newSettings: GeneralSettings = {
            displayNotesCreatedOnDate: false,
            displayNoteIndicator: true,
            useModifierKeyToCreateNote: true,
            firstDayOfWeek: DayOfWeek.Monday
        };
        const mockSettings = { ...DEFAULT_DAILY_NOTE_CALENDAR_SETTINGS, generalSettings: {
            displayNotesCreatedOnDate: true,
                displayNoteIndicator: false,
                useModifierKeyToCreateNote: false,
                firstDayOfWeek: DayOfWeek.Sunday
        }};
        settingsAdapter.getSettings.mockResolvedValueOnce(mockSettings);

        await repository.storeSettings(newSettings);

        expect(settingsAdapter.getSettings).toHaveBeenCalledWith(DEFAULT_DAILY_NOTE_CALENDAR_SETTINGS);
        expect(settingsAdapter.storeSettings).toHaveBeenCalledWith({
            ...mockSettings,
            generalSettings: newSettings,
        });
    });
});