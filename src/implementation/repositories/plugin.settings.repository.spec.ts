import { PluginSettingsRepository } from './plugin.settings.repository';
import { Plugin } from 'obsidian';
import { DEFAULT_SETTINGS, Settings } from 'src/domain/models/Settings';

describe('PluginSettingsRepository', () => {
    let plugin: jest.Mocked<Plugin>;
    let repository: PluginSettingsRepository;

    beforeEach(() => {
        plugin = {
            loadData: jest.fn(),
            saveData: jest.fn()
        } as unknown as jest.Mocked<Plugin>;

        repository = new PluginSettingsRepository(plugin);
    });

    it('should return default settings if no settings are stored', async () => {
        plugin.loadData.mockResolvedValue(null);

        const result = await repository.getSettings();

        expect(result).toEqual(DEFAULT_SETTINGS);
        expect(plugin.loadData).toHaveBeenCalled();
    });

    it('should return stored settings merged with default settings', async () => {
        const storedSettings: Partial<Settings> = { dailyNoteNameTemplate: 'someValue' };
        plugin.loadData.mockResolvedValue(storedSettings);

        const result = await repository.getSettings();

        expect(result).toEqual({ ...DEFAULT_SETTINGS, ...storedSettings });
        expect(plugin.loadData).toHaveBeenCalled();
    });

    it('should store settings', async () => {
        const settings: Settings = { ...DEFAULT_SETTINGS, dailyNoteTemplateFile: 'someValue' };

        await repository.storeSettings(settings);

        expect(plugin.saveData).toHaveBeenCalledWith(settings);
    });
});