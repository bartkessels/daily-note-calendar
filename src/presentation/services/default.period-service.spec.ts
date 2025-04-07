import {mockPeriodicNoteManager} from 'src/test-helpers/manager.mocks';
import {DefaultPeriodService} from 'src/presentation/services/default.period-service';
import {PluginSettings} from 'src/domain/settings/plugin.settings';
import {GeneralSettings} from 'src/domain/settings/general.settings';
import {Period, PeriodType} from 'src/domain/models/period.model';
import {DEFAULT_DAILY_NOTE_SETTINGS} from 'src/domain/settings/period-note.settings';
import {ModifierKey} from 'src/domain/models/modifier-key';

describe('DefaultPeriodService', () => {
    const periodicNoteManager = mockPeriodicNoteManager;
    const period = <Period> {
        date: new Date(2023, 9, 2),
        name: '02',
        type: PeriodType.Day
    };

    let service: DefaultPeriodService;

    beforeEach(() => {
        service = new DefaultPeriodService(periodicNoteManager);
    });

    describe('openNoteInCurrentTab', () => {
        afterEach(() => {
            jest.clearAllMocks();
        });

        it('should call the createNote and openNote action if the setting requires a modifier key and the modifier key is pressed', async () => {
            // Arrange
            const key = ModifierKey.Meta;
            const settings = DEFAULT_DAILY_NOTE_SETTINGS;
            const generalSettings = <PluginSettings> {
                generalSettings: <GeneralSettings>{
                    useModifierKeyToCreateNote: true
                }
            };

            // Act
            await service.initialize(generalSettings);
            await service.openNoteInCurrentTab(key, period, settings);

            // Assert
            expect(periodicNoteManager.createNote).toHaveBeenCalledWith(settings, period);
            expect(periodicNoteManager.openNote).toHaveBeenCalledWith(settings, period);
        });

        it('should only call the openNote action if settings require a modifier key and the modifier key is not pressed', async () => {
            // Arrange
            const key = ModifierKey.None;
            const settings = DEFAULT_DAILY_NOTE_SETTINGS;
            const generalSettings = <PluginSettings> {
                generalSettings: <GeneralSettings>{
                    useModifierKeyToCreateNote: true
                }
            };

            // Act
            await service.initialize(generalSettings);
            await service.openNoteInCurrentTab(key, period, settings);

            // Assert
            expect(periodicNoteManager.createNote).not.toHaveBeenCalled();
            expect(periodicNoteManager.openNote).toHaveBeenCalledWith(settings, period);
        });

        it('should call the createNote and openNote action if the settings does not require a modifier key', async () => {
            // Arrange
            const key = ModifierKey.None;
            const settings = DEFAULT_DAILY_NOTE_SETTINGS;
            const generalSettings = <PluginSettings> {
                generalSettings: <GeneralSettings>{
                    useModifierKeyToCreateNote: false
                }
            };

            // Act
            await service.initialize(generalSettings);
            await service.openNoteInCurrentTab(key, period, settings);

            // Assert
            expect(periodicNoteManager.createNote).toHaveBeenCalledWith(settings, period);
            expect(periodicNoteManager.openNote).toHaveBeenCalledWith(settings, period);
        });
    });

    describe('openNoteInHorizontalSplitView', () => {
        afterEach(() => {
            jest.clearAllMocks();
        });

        it('should call the createNote and openNoteInHorizontalSplitView action if the setting requires a modifier key and the modifier key is pressed', async () => {
            // Arrange
            const key = ModifierKey.Meta;
            const settings = DEFAULT_DAILY_NOTE_SETTINGS;
            const generalSettings = <PluginSettings> {
                generalSettings: <GeneralSettings>{
                    useModifierKeyToCreateNote: true
                }
            };

            // Act
            await service.initialize(generalSettings);
            await service.openNoteInHorizontalSplitView(key, period, settings);

            // Assert
            expect(periodicNoteManager.createNote).toHaveBeenCalledWith(settings, period);
            expect(periodicNoteManager.openNoteInHorizontalSplitView).toHaveBeenCalledWith(settings, period);
        });

        it('should only call the openNoteInHorizontalSplitView action if settings require a modifier key and the modifier key is not pressed', async () => {
            // Arrange
            const key = ModifierKey.None;
            const settings = DEFAULT_DAILY_NOTE_SETTINGS;
            const generalSettings = <PluginSettings> {
                generalSettings: <GeneralSettings>{
                    useModifierKeyToCreateNote: true
                }
            };

            // Act
            await service.initialize(generalSettings);
            await service.openNoteInHorizontalSplitView(key, period, settings);

            // Assert
            expect(periodicNoteManager.createNote).not.toHaveBeenCalled();
            expect(periodicNoteManager.openNoteInHorizontalSplitView).toHaveBeenCalledWith(settings, period);
        });

        it('should call the createNote and openNoteInHorizontalSplitView action if the settings does not require a modifier key', async () => {
            // Arrange
            const key = ModifierKey.None;
            const settings = DEFAULT_DAILY_NOTE_SETTINGS;
            const generalSettings = <PluginSettings> {
                generalSettings: <GeneralSettings>{
                    useModifierKeyToCreateNote: false
                }
            };

            // Act
            await service.initialize(generalSettings);
            await service.openNoteInHorizontalSplitView(key, period, settings);

            // Assert
            expect(periodicNoteManager.createNote).toHaveBeenCalledWith(settings, period);
            expect(periodicNoteManager.openNoteInHorizontalSplitView).toHaveBeenCalledWith(settings, period);
        });
    });

    describe('openNoteInVerticalSplitView', () => {
        afterEach(() => {
            jest.clearAllMocks();
        });

        it('should call the createNote and openNoteInVerticalSplitView action if the setting requires a modifier key and the modifier key is pressed', async () => {
            // Arrange
            const key = ModifierKey.Meta;
            const settings = DEFAULT_DAILY_NOTE_SETTINGS;
            const generalSettings = <PluginSettings> {
                generalSettings: <GeneralSettings>{
                    useModifierKeyToCreateNote: true
                }
            };

            // Act
            await service.initialize(generalSettings);
            await service.openNoteInVerticalSplitView(key, period, settings);

            // Assert
            expect(periodicNoteManager.createNote).toHaveBeenCalledWith(settings, period);
            expect(periodicNoteManager.openNoteInVerticalSplitView).toHaveBeenCalledWith(settings, period);
        });

        it('should only call the openNoteInVerticalSplitView action if settings require a modifier key and the modifier key is not pressed', async () => {
            // Arrange
            const key = ModifierKey.None;
            const settings = DEFAULT_DAILY_NOTE_SETTINGS;
            const generalSettings = <PluginSettings> {
                generalSettings: <GeneralSettings>{
                    useModifierKeyToCreateNote: true
                }
            };

            // Act
            await service.initialize(generalSettings);
            await service.openNoteInVerticalSplitView(key, period, settings);

            // Assert
            expect(periodicNoteManager.createNote).not.toHaveBeenCalled();
            expect(periodicNoteManager.openNoteInVerticalSplitView).toHaveBeenCalledWith(settings, period);
        });

        it('should call the createNote and openNoteInVerticalSplitView action if the settings does not require a modifier key', async () => {
            // Arrange
            const key = ModifierKey.None;
            const settings = DEFAULT_DAILY_NOTE_SETTINGS;
            const generalSettings = <PluginSettings> {
                generalSettings: <GeneralSettings>{
                    useModifierKeyToCreateNote: false
                }
            };

            // Act
            await service.initialize(generalSettings);
            await service.openNoteInVerticalSplitView(key, period, settings);

            // Assert
            expect(periodicNoteManager.createNote).toHaveBeenCalledWith(settings, period);
            expect(periodicNoteManager.openNoteInVerticalSplitView).toHaveBeenCalledWith(settings, period);
        });
    });

    describe('deleteNote', () => {
        it('should call the manager', async () => {
            // Arrange
            const settings = DEFAULT_DAILY_NOTE_SETTINGS;

            // Act
            await service.deleteNote(period, settings);

            // Assert
            expect(periodicNoteManager.deleteNote).toHaveBeenCalledWith(settings, period);
        });
    });

    describe('hasPeriodicNote', () => {
        it('should call the manager', async () => {
            // Arrange
            const settings = DEFAULT_DAILY_NOTE_SETTINGS;

            // Act
            await service.hasPeriodicNote(period, settings);

            // Assert
            expect(periodicNoteManager.doesNoteExist).toHaveBeenCalledWith(settings, period);
        });
    });
});