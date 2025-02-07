import {SettingsAdapter} from 'src-old/domain/adapters/settings.adapter';
import {DEFAULT_DAILY_NOTE_CALENDAR_SETTINGS} from 'src-old/domain/models/settings/daily-note-calendar.settings';
import {NotesSettingsRepository} from 'src-old/implementation/repositories/notes.settings-repository';
import {NotesSettings} from 'src-old/domain/models/settings/notes.settings';

describe('NotesSettingsRepository', () => {
    let settingsAdapter: jest.Mocked<SettingsAdapter>;
    let repository: NotesSettingsRepository;

    beforeEach(() => {
        settingsAdapter = {
            getSettings: jest.fn(),
            storeSettings: jest.fn(),
        } as jest.Mocked<SettingsAdapter>;

        repository = new NotesSettingsRepository(settingsAdapter);
    });

    it('should get notes settings', async () => {
        const mockSettings = { ...DEFAULT_DAILY_NOTE_CALENDAR_SETTINGS, notesSettings: {
            displayDateTemplate: 'HH:mm',
            useCreatedOnDateFromProperties: false,
            createdOnDatePropertyName: '',
            createdOnPropertyFormat: ''
        } };
        settingsAdapter.getSettings.mockResolvedValueOnce(mockSettings);

        const settings = await repository.getSettings();

        expect(settingsAdapter.getSettings).toHaveBeenCalledWith(DEFAULT_DAILY_NOTE_CALENDAR_SETTINGS);
        expect(settings).toEqual(mockSettings.notesSettings);
    });

    it('should store notes settings', async () => {
        const newSettings: NotesSettings = {
            displayDateTemplate: 'HH:mm',
            useCreatedOnDateFromProperties: false,
            createdOnDatePropertyName: '',
            createdOnPropertyFormat: ''
        };
        const mockSettings = { ...DEFAULT_DAILY_NOTE_CALENDAR_SETTINGS, notesSettings: {
                displayDateTemplate: 'HH:mm',
                useCreatedOnDateFromProperties: true,
                createdOnDatePropertyName: 'created_on',
                createdOnPropertyFormat: 'yyyyMMdd'
        } };
        settingsAdapter.getSettings.mockResolvedValueOnce(mockSettings);

        await repository.storeSettings(newSettings);

        expect(settingsAdapter.getSettings).toHaveBeenCalledWith(DEFAULT_DAILY_NOTE_CALENDAR_SETTINGS);
        expect(settingsAdapter.storeSettings).toHaveBeenCalledWith({
            ...mockSettings,
            notesSettings: newSettings
        });
    });
});