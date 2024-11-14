import {SettingsAdapter} from 'src/domain/adapters/settings.adapter';
import {DEFAULT_SETTINGS, QuarterlyNoteSettings} from 'src/domain/models/settings';
import {QuarterlyNoteSettingsRepository} from 'src/implementation/repositories/quarterly-note.settings-repository';

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
        const mockSettings = { ...DEFAULT_SETTINGS, quarterlyNotes: { nameTemplate: 'template', folder: 'folder', templateFile: 'templateFile' } };
        settingsAdapter.getSettings.mockResolvedValueOnce(mockSettings);

        const settings = await repository.getSettings();

        expect(settingsAdapter.getSettings).toHaveBeenCalledWith(DEFAULT_SETTINGS);
        expect(settings).toEqual(mockSettings.quarterlyNotes);
    });

    it('should store quarterly note settings', async () => {
        const newSettings: QuarterlyNoteSettings = { nameTemplate: 'newTemplate', folder: 'newFolder', templateFile: 'newTemplateFile' };
        const mockSettings = { ...DEFAULT_SETTINGS, quarterlyNotes: { nameTemplate: 'template', folder: 'folder', templateFile: 'templateFile' } };
        settingsAdapter.getSettings.mockResolvedValueOnce(mockSettings);

        await repository.storeSettings(newSettings);

        expect(settingsAdapter.getSettings).toHaveBeenCalledWith(DEFAULT_SETTINGS);
        expect(settingsAdapter.storeSettings).toHaveBeenCalledWith({
            ...mockSettings,
            quarterlyNotes: newSettings,
        });
    });
});