import { SettingsAdapter } from 'src/domain/adapters/settings.adapter';
import {YearlyNoteSettingsRepository} from 'src/implementation/repositories/yearly-note.settings-repository';
import {DEFAULT_SETTINGS, YearlyNoteSettings} from 'src/domain/models/settings';

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
        const mockSettings = { ...DEFAULT_SETTINGS, yearlyNotes: { nameTemplate: 'template', folder: 'folder', templateFile: 'templateFile' } };
        settingsAdapter.getSettings.mockResolvedValueOnce(mockSettings);

        const settings = await repository.getSettings();

        expect(settingsAdapter.getSettings).toHaveBeenCalledWith(DEFAULT_SETTINGS);
        expect(settings).toEqual(mockSettings.yearlyNotes);
    });

    it('should store yearly note settings', async () => {
        const newSettings: YearlyNoteSettings = { nameTemplate: 'newTemplate', folder: 'newFolder', templateFile: 'newTemplateFile' };
        const mockSettings = { ...DEFAULT_SETTINGS, yearlyNotes: { nameTemplate: 'template', folder: 'folder', templateFile: 'templateFile' } };
        settingsAdapter.getSettings.mockResolvedValueOnce(mockSettings);

        await repository.storeSettings(newSettings);

        expect(settingsAdapter.getSettings).toHaveBeenCalledWith(DEFAULT_SETTINGS);
        expect(settingsAdapter.storeSettings).toHaveBeenCalledWith({
            ...mockSettings,
            yearlyNotes: newSettings,
        });
    });
});