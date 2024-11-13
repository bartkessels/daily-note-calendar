import { MonthlyNoteSettingsRepository } from './monthly-note.settings-repository';
import { SettingsAdapter } from 'src/domain/adapters/settings.adapter';
import { MonthlyNoteSettings, DEFAULT_SETTINGS } from 'src/domain/models/settings';

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
        const mockSettings = { ...DEFAULT_SETTINGS, monthlyNotes: { nameTemplate: 'template', folder: 'folder', templateFile: 'templateFile' } };
        settingsAdapter.getSettings.mockResolvedValueOnce(mockSettings);

        const settings = await repository.getSettings();

        expect(settingsAdapter.getSettings).toHaveBeenCalledWith(DEFAULT_SETTINGS);
        expect(settings).toEqual(mockSettings.monthlyNotes);
    });

    it('should store monthly note settings', async () => {
        const newSettings: MonthlyNoteSettings = { nameTemplate: 'newTemplate', folder: 'newFolder', templateFile: 'newTemplateFile' };
        const mockSettings = { ...DEFAULT_SETTINGS, monthlyNotes: { nameTemplate: 'template', folder: 'folder', templateFile: 'templateFile' } };
        settingsAdapter.getSettings.mockResolvedValueOnce(mockSettings);

        await repository.storeSettings(newSettings);

        expect(settingsAdapter.getSettings).toHaveBeenCalledWith(DEFAULT_SETTINGS);
        expect(settingsAdapter.storeSettings).toHaveBeenCalledWith({
            ...mockSettings,
            monthlyNotes: newSettings,
        });
    });
});