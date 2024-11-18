import {MonthlyNoteSettingsRepository} from 'src/implementation/repositories/monthly-note.settings-repository';
import {SettingsAdapter} from 'src/domain/adapters/settings.adapter';
import {DEFAULT_DAILY_NOTE_CALENDAR_SETTINGS} from 'src/domain/models/settings/daily-note-calendar.settings';
import {MonthlyNotesPeriodicNoteSettings} from 'src/domain/models/settings/monthly-notes.periodic-note-settings';

describe('MonthlyNoteSettingsRepository', () => {
    let settingsAdapter: jest.Mocked<SettingsAdapter>;
    let repository: MonthlyNoteSettingsRepository;

    beforeEach(() => {
        settingsAdapter = {
            getSettings: jest.fn(),
            storeSettings: jest.fn(),
        } as jest.Mocked<SettingsAdapter>;

        repository = new MonthlyNoteSettingsRepository(settingsAdapter);
    });

    it('should get monthly note settings', async () => {
        const mockSettings = { ...DEFAULT_DAILY_NOTE_CALENDAR_SETTINGS, monthlyNotes: { nameTemplate: 'template', folder: 'folder', templateFile: 'templateFile' } };
        settingsAdapter.getSettings.mockResolvedValueOnce(mockSettings);

        const settings = await repository.getSettings();

        expect(settingsAdapter.getSettings).toHaveBeenCalledWith(DEFAULT_DAILY_NOTE_CALENDAR_SETTINGS);
        expect(settings).toEqual(mockSettings.monthlyNotes);
    });

    it('should store monthly note settings', async () => {
        const newSettings: MonthlyNotesPeriodicNoteSettings = { nameTemplate: 'newTemplate', folder: 'newFolder', templateFile: 'newTemplateFile' };
        const mockSettings = { ...DEFAULT_DAILY_NOTE_CALENDAR_SETTINGS, monthlyNotes: { nameTemplate: 'template', folder: 'folder', templateFile: 'templateFile' } };
        settingsAdapter.getSettings.mockResolvedValueOnce(mockSettings);

        await repository.storeSettings(newSettings);

        expect(settingsAdapter.getSettings).toHaveBeenCalledWith(DEFAULT_DAILY_NOTE_CALENDAR_SETTINGS);
        expect(settingsAdapter.storeSettings).toHaveBeenCalledWith({
            ...mockSettings,
            monthlyNotes: newSettings,
        });
    });
});