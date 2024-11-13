import { WeeklyNoteSettingsRepository } from './weekly-note.settings-repository';
import { SettingsAdapter } from 'src/domain/adapters/settings.adapter';
import { WeeklyNoteSettings, DEFAULT_SETTINGS } from 'src/domain/models/settings';

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
        const mockSettings = { ...DEFAULT_SETTINGS, weeklyNotes: { nameTemplate: 'template', folder: 'folder', templateFile: 'templateFile' } };
        settingsAdapter.getSettings.mockResolvedValueOnce(mockSettings);

        const settings = await repository.getSettings();

        expect(settingsAdapter.getSettings).toHaveBeenCalledWith(DEFAULT_SETTINGS);
        expect(settings).toEqual(mockSettings.weeklyNotes);
    });

    it('should store weekly note settings', async () => {
        const newSettings: WeeklyNoteSettings = { nameTemplate: 'newTemplate', folder: 'newFolder', templateFile: 'newTemplateFile' };
        const mockSettings = { ...DEFAULT_SETTINGS, weeklyNotes: { nameTemplate: 'template', folder: 'folder', templateFile: 'templateFile' } };
        settingsAdapter.getSettings.mockResolvedValueOnce(mockSettings);

        await repository.storeSettings(newSettings);

        expect(settingsAdapter.getSettings).toHaveBeenCalledWith(DEFAULT_SETTINGS);
        expect(settingsAdapter.storeSettings).toHaveBeenCalledWith({
            ...mockSettings,
            weeklyNotes: newSettings,
        });
    });
});