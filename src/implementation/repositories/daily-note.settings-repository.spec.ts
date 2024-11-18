import {DailyNoteSettingsRepository} from 'src/implementation/repositories/daily-note.settings-repository';
import {SettingsAdapter} from 'src/domain/adapters/settings.adapter';
import {DEFAULT_DAILY_NOTE_CALENDAR_SETTINGS} from 'src/domain/models/settings/daily-note-calendar.settings';
import {DailyNotesPeriodicNoteSettings} from 'src/domain/models/settings/daily-notes.periodic-note-settings';

describe('DailyNoteSettingsRepository', () => {
    let settingsAdapter: jest.Mocked<SettingsAdapter>;
    let repository: DailyNoteSettingsRepository;

    beforeEach(() => {
        settingsAdapter = {
            getSettings: jest.fn(),
            storeSettings: jest.fn(),
        } as jest.Mocked<SettingsAdapter>;

        repository = new DailyNoteSettingsRepository(settingsAdapter);
    });

    it('should get daily note settings', async () => {
        const mockSettings = { ...DEFAULT_DAILY_NOTE_CALENDAR_SETTINGS, dailyNotes: { nameTemplate: 'template', folder: 'folder', templateFile: 'templateFile' } };
        settingsAdapter.getSettings.mockResolvedValueOnce(mockSettings);

        const settings = await repository.getSettings();

        expect(settingsAdapter.getSettings).toHaveBeenCalledWith(DEFAULT_DAILY_NOTE_CALENDAR_SETTINGS);
        expect(settings).toEqual(mockSettings.dailyNotes);
    });

    it('should store daily note settings', async () => {
        const newSettings: DailyNotesPeriodicNoteSettings = { nameTemplate: 'newTemplate', folder: 'newFolder', templateFile: 'newTemplateFile' };
        const mockSettings = { ...DEFAULT_DAILY_NOTE_CALENDAR_SETTINGS, dailyNotes: { nameTemplate: 'template', folder: 'folder', templateFile: 'templateFile' } };
        settingsAdapter.getSettings.mockResolvedValueOnce(mockSettings);

        await repository.storeSettings(newSettings);

        expect(settingsAdapter.getSettings).toHaveBeenCalledWith(DEFAULT_DAILY_NOTE_CALENDAR_SETTINGS);
        expect(settingsAdapter.storeSettings).toHaveBeenCalledWith({
            ...mockSettings,
            dailyNotes: newSettings,
        });
    });
});