import {SettingsAdapter} from 'src-old/domain/adapters/settings.adapter';
import {QuarterlyNoteSettingsRepository} from 'src-old/implementation/repositories/quarterly-note.settings-repository';
import {DEFAULT_DAILY_NOTE_CALENDAR_SETTINGS} from 'src-old/domain/models/settings/daily-note-calendar.settings';
import {QuarterlyNotesPeriodicNoteSettings} from 'src-old/domain/models/settings/quarterly-notes.periodic-note-settings';

describe('QuarterlyNoteSettingsRepository', () => {
    let settingsAdapter: jest.Mocked<SettingsAdapter>;
    let repository: QuarterlyNoteSettingsRepository;

    beforeEach(() => {
        settingsAdapter = {
            getSettings: jest.fn(),
            storeSettings: jest.fn(),
        } as jest.Mocked<SettingsAdapter>;

        repository = new QuarterlyNoteSettingsRepository(settingsAdapter);
    });

    it('should get quarterly note settings', async () => {
        const mockSettings = { ...DEFAULT_DAILY_NOTE_CALENDAR_SETTINGS, quarterlyNotes: { nameTemplate: 'template', folder: 'folder', templateFile: 'templateFile' } };
        settingsAdapter.getSettings.mockResolvedValueOnce(mockSettings);

        const settings = await repository.getSettings();

        expect(settingsAdapter.getSettings).toHaveBeenCalledWith(DEFAULT_DAILY_NOTE_CALENDAR_SETTINGS);
        expect(settings).toEqual(mockSettings.quarterlyNotes);
    });

    it('should store quarterly note settings', async () => {
        const newSettings: QuarterlyNotesPeriodicNoteSettings = { nameTemplate: 'newTemplate', folder: 'newFolder', templateFile: 'newTemplateFile' };
        const mockSettings = { ...DEFAULT_DAILY_NOTE_CALENDAR_SETTINGS, quarterlyNotes: { nameTemplate: 'template', folder: 'folder', templateFile: 'templateFile' } };
        settingsAdapter.getSettings.mockResolvedValueOnce(mockSettings);

        await repository.storeSettings(newSettings);

        expect(settingsAdapter.getSettings).toHaveBeenCalledWith(DEFAULT_DAILY_NOTE_CALENDAR_SETTINGS);
        expect(settingsAdapter.storeSettings).toHaveBeenCalledWith({
            ...mockSettings,
            quarterlyNotes: newSettings,
        });
    });
});