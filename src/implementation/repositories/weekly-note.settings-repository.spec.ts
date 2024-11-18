import {WeeklyNoteSettingsRepository} from 'src/implementation/repositories/weekly-note.settings-repository';
import {SettingsAdapter} from 'src/domain/adapters/settings.adapter';
import {DEFAULT_DAILY_NOTE_CALENDAR_SETTINGS} from 'src/domain/models/settings/daily-note-calendar.settings';
import {WeeklyNotesPeriodicNoteSettings} from 'src/domain/models/settings/weekly-notes.periodic-note-settings';

describe('WeeklyNoteSettingsRepository', () => {
    let settingsAdapter: jest.Mocked<SettingsAdapter>;
    let repository: WeeklyNoteSettingsRepository;

    beforeEach(() => {
        settingsAdapter = {
            getSettings: jest.fn(),
            storeSettings: jest.fn(),
        } as jest.Mocked<SettingsAdapter>;

        repository = new WeeklyNoteSettingsRepository(settingsAdapter);
    });

    it('should get weekly note settings', async () => {
        const mockSettings = { ...DEFAULT_DAILY_NOTE_CALENDAR_SETTINGS, weeklyNotes: { nameTemplate: 'template', folder: 'folder', templateFile: 'templateFile' } };
        settingsAdapter.getSettings.mockResolvedValueOnce(mockSettings);

        const settings = await repository.getSettings();

        expect(settingsAdapter.getSettings).toHaveBeenCalledWith(DEFAULT_DAILY_NOTE_CALENDAR_SETTINGS);
        expect(settings).toEqual(mockSettings.weeklyNotes);
    });

    it('should store weekly note settings', async () => {
        const newSettings: WeeklyNotesPeriodicNoteSettings = { nameTemplate: 'newTemplate', folder: 'newFolder', templateFile: 'newTemplateFile' };
        const mockSettings = { ...DEFAULT_DAILY_NOTE_CALENDAR_SETTINGS, weeklyNotes: { nameTemplate: 'template', folder: 'folder', templateFile: 'templateFile' } };
        settingsAdapter.getSettings.mockResolvedValueOnce(mockSettings);

        await repository.storeSettings(newSettings);

        expect(settingsAdapter.getSettings).toHaveBeenCalledWith(DEFAULT_DAILY_NOTE_CALENDAR_SETTINGS);
        expect(settingsAdapter.storeSettings).toHaveBeenCalledWith({
            ...mockSettings,
            weeklyNotes: newSettings,
        });
    });
});