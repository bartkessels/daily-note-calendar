import {SettingsAdapter} from 'src-old/domain/adapters/settings.adapter';
import {YearlyNoteSettingsRepository} from 'src-old/implementation/repositories/yearly-note.settings-repository';
import {DEFAULT_DAILY_NOTE_CALENDAR_SETTINGS} from 'src-old/domain/models/settings/daily-note-calendar.settings';
import {YearlyNotesPeriodicNoteSettings} from 'src-old/domain/models/settings/yearly-notes.periodic-note-settings';

describe('YearlyNoteSettingsRepository', () => {
    let settingsAdapter: jest.Mocked<SettingsAdapter>;
    let repository: YearlyNoteSettingsRepository;

    beforeEach(() => {
        settingsAdapter = {
            getSettings: jest.fn(),
            storeSettings: jest.fn(),
        } as jest.Mocked<SettingsAdapter>;

        repository = new YearlyNoteSettingsRepository(settingsAdapter);
    });

    it('should get yearly note settings', async () => {
        const mockSettings = { ...DEFAULT_DAILY_NOTE_CALENDAR_SETTINGS, yearlyNotes: { nameTemplate: 'template', folder: 'folder', templateFile: 'templateFile' } };
        settingsAdapter.getSettings.mockResolvedValueOnce(mockSettings);

        const settings = await repository.getSettings();

        expect(settingsAdapter.getSettings).toHaveBeenCalledWith(DEFAULT_DAILY_NOTE_CALENDAR_SETTINGS);
        expect(settings).toEqual(mockSettings.yearlyNotes);
    });

    it('should store yearly note settings', async () => {
        const newSettings: YearlyNotesPeriodicNoteSettings = { nameTemplate: 'newTemplate', folder: 'newFolder', templateFile: 'newTemplateFile' };
        const mockSettings = { ...DEFAULT_DAILY_NOTE_CALENDAR_SETTINGS, yearlyNotes: { nameTemplate: 'template', folder: 'folder', templateFile: 'templateFile' } };
        settingsAdapter.getSettings.mockResolvedValueOnce(mockSettings);

        await repository.storeSettings(newSettings);

        expect(settingsAdapter.getSettings).toHaveBeenCalledWith(DEFAULT_DAILY_NOTE_CALENDAR_SETTINGS);
        expect(settingsAdapter.storeSettings).toHaveBeenCalledWith({
            ...mockSettings,
            yearlyNotes: newSettings,
        });
    });
});