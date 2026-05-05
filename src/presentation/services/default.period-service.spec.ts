import {mockPeriodicNoteManager} from 'src/test-helpers/manager.mocks';
import {DefaultPeriodService} from 'src/presentation/services/default.period-service';
import {PluginSettings} from 'src/domain/settings/plugin.settings';
import {GeneralSettings} from 'src/domain/settings/general.settings';
import {Period, PeriodType} from 'src/domain/models/period.model';
import {DEFAULT_DAILY_NOTE_SETTINGS} from 'src/domain/settings/period-note.settings';
import {ModifierKey} from 'src/domain/models/modifier-key';
import {when} from 'jest-when';
import {DayOfWeek, WeekNumberStandard} from 'src/domain/models/week';

describe('DefaultPeriodService', () => {
    const periodicNoteManager = mockPeriodicNoteManager;
    const period = <Period> {
        date: new Date(2023, 9, 2),
        name: '02',
        type: PeriodType.Day,
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
                    useModifierKeyToCreateNote: true,
                    firstDayOfWeek: DayOfWeek.Monday,
                },
            };

            // Act
            await service.initialize(generalSettings);
            await service.openNoteInCurrentTab(key, period, settings);

            // Assert
            expect(periodicNoteManager.createNote).toHaveBeenCalledWith(settings, period, DayOfWeek.Monday);
            expect(periodicNoteManager.openNote).toHaveBeenCalledWith(settings, period, DayOfWeek.Monday);
        });

        it('should only call the openNote action if settings require a modifier key and the modifier key is not pressed if the note exists', async () => {
            // Arrange
            const key = ModifierKey.None;
            const settings = DEFAULT_DAILY_NOTE_SETTINGS;
            const generalSettings = <PluginSettings> {
                generalSettings: <GeneralSettings>{
                    useModifierKeyToCreateNote: true,
                    firstDayOfWeek: DayOfWeek.Monday,
                },
            };
            when(periodicNoteManager.doesNoteExist).calledWith(settings, period, DayOfWeek.Monday).mockReturnValue(true);

            // Act
            await service.initialize(generalSettings);
            await service.openNoteInCurrentTab(key, period, settings);

            // Assert
            expect(periodicNoteManager.createNote).not.toHaveBeenCalled();
            expect(periodicNoteManager.openNote).toHaveBeenCalledWith(settings, period, DayOfWeek.Monday);
        });

        it('should not call the openNote action if settings require a modifier key and the modifier key is not pressed if the note does not exist', async () => {
            // Arrange
            const key = ModifierKey.None;
            const settings = DEFAULT_DAILY_NOTE_SETTINGS;
            const generalSettings = <PluginSettings> {
                generalSettings: <GeneralSettings>{
                    useModifierKeyToCreateNote: true,
                    firstDayOfWeek: DayOfWeek.Monday,
                },
            };
            when(periodicNoteManager.doesNoteExist).calledWith(settings, period, DayOfWeek.Monday).mockReturnValue(false);

            // Act
            await service.initialize(generalSettings);
            await service.openNoteInCurrentTab(key, period, settings);

            // Assert
            expect(periodicNoteManager.createNote).not.toHaveBeenCalled();
            expect(periodicNoteManager.openNote).not.toHaveBeenCalled();
        });

        it('should call the createNote and openNote action if the settings do not require a modifier key if the note exists', async () => {
            // Arrange
            const key = ModifierKey.None;
            const settings = DEFAULT_DAILY_NOTE_SETTINGS;
            const generalSettings = <PluginSettings> {
                generalSettings: <GeneralSettings>{
                    useModifierKeyToCreateNote: false,
                    firstDayOfWeek: DayOfWeek.Monday,
                },
            };
            when(periodicNoteManager.doesNoteExist).calledWith(settings, period, DayOfWeek.Monday).mockReturnValue(true);

            // Act
            await service.initialize(generalSettings);
            await service.openNoteInCurrentTab(key, period, settings);

            // Assert
            expect(periodicNoteManager.createNote).toHaveBeenCalledWith(settings, period, DayOfWeek.Monday);
            expect(periodicNoteManager.openNote).toHaveBeenCalledWith(settings, period, DayOfWeek.Monday);
        });

        it('should call the createNote and openNote action if the settings do not require a modifier key if the note does not exist', async () => {
            // Arrange
            const key = ModifierKey.None;
            const settings = DEFAULT_DAILY_NOTE_SETTINGS;
            const generalSettings = <PluginSettings> {
                generalSettings: <GeneralSettings>{
                    useModifierKeyToCreateNote: false,
                    firstDayOfWeek: DayOfWeek.Monday,
                },
            };
            when(periodicNoteManager.doesNoteExist).calledWith(settings, period, DayOfWeek.Monday).mockReturnValue(false);

            // Act
            await service.initialize(generalSettings);
            await service.openNoteInCurrentTab(key, period, settings);

            // Assert
            expect(periodicNoteManager.createNote).toHaveBeenCalledWith(settings, period, DayOfWeek.Monday);
            expect(periodicNoteManager.openNote).toHaveBeenCalledWith(settings, period, DayOfWeek.Monday);
        });

        it('should pass firstDayOfWeek from settings to the manager', async () => {
            // Arrange — Sunday-start diverges from Monday-start on 2024-01-07
            const key = ModifierKey.Meta;
            const settings = DEFAULT_DAILY_NOTE_SETTINGS;
            const generalSettings = <PluginSettings> {
                generalSettings: <GeneralSettings>{
                    useModifierKeyToCreateNote: true,
                    firstDayOfWeek: DayOfWeek.Sunday,
                },
            };

            // Act
            await service.initialize(generalSettings);
            await service.openNoteInCurrentTab(key, period, settings);

            // Assert
            expect(periodicNoteManager.createNote).toHaveBeenCalledWith(settings, period, DayOfWeek.Sunday);
            expect(periodicNoteManager.openNote).toHaveBeenCalledWith(settings, period, DayOfWeek.Sunday);
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
                    useModifierKeyToCreateNote: true,
                    firstDayOfWeek: DayOfWeek.Monday,
                },
            };

            // Act
            await service.initialize(generalSettings);
            await service.openNoteInHorizontalSplitView(key, period, settings);

            // Assert
            expect(periodicNoteManager.createNote).toHaveBeenCalledWith(settings, period, DayOfWeek.Monday);
            expect(periodicNoteManager.openNoteInHorizontalSplitView).toHaveBeenCalledWith(settings, period, DayOfWeek.Monday);
        });

        it('should only call the openNoteInHorizontalSplitView action if settings require a modifier key and the modifier key is not pressed if the note exists', async () => {
            // Arrange
            const key = ModifierKey.None;
            const settings = DEFAULT_DAILY_NOTE_SETTINGS;
            const generalSettings = <PluginSettings> {
                generalSettings: <GeneralSettings>{
                    useModifierKeyToCreateNote: true,
                    firstDayOfWeek: DayOfWeek.Monday,
                },
            };
            when(periodicNoteManager.doesNoteExist).calledWith(settings, period, DayOfWeek.Monday).mockReturnValue(true);

            // Act
            await service.initialize(generalSettings);
            await service.openNoteInHorizontalSplitView(key, period, settings);

            // Assert
            expect(periodicNoteManager.createNote).not.toHaveBeenCalled();
            expect(periodicNoteManager.openNoteInHorizontalSplitView).toHaveBeenCalledWith(settings, period, DayOfWeek.Monday);
        });

        it('should not call the openNoteInHorizontalSplitView action if settings require a modifier key and the modifier key is not pressed if the note does not exist', async () => {
            // Arrange
            const key = ModifierKey.None;
            const settings = DEFAULT_DAILY_NOTE_SETTINGS;
            const generalSettings = <PluginSettings> {
                generalSettings: <GeneralSettings>{
                    useModifierKeyToCreateNote: true,
                    firstDayOfWeek: DayOfWeek.Monday,
                },
            };
            when(periodicNoteManager.doesNoteExist).calledWith(settings, period, DayOfWeek.Monday).mockReturnValue(false);

            // Act
            await service.initialize(generalSettings);
            await service.openNoteInHorizontalSplitView(key, period, settings);

            // Assert
            expect(periodicNoteManager.createNote).not.toHaveBeenCalled();
            expect(periodicNoteManager.openNoteInHorizontalSplitView).not.toHaveBeenCalled();
        });

        it('should call the createNote and openNoteInHorizontalSplitView action if the settings do not require a modifier key and the note already exists', async () => {
            // Arrange
            const key = ModifierKey.None;
            const settings = DEFAULT_DAILY_NOTE_SETTINGS;
            const generalSettings = <PluginSettings> {
                generalSettings: <GeneralSettings>{
                    useModifierKeyToCreateNote: false,
                    firstDayOfWeek: DayOfWeek.Monday,
                },
            };
            when(periodicNoteManager.doesNoteExist).calledWith(settings, period, DayOfWeek.Monday).mockReturnValue(true);

            // Act
            await service.initialize(generalSettings);
            await service.openNoteInHorizontalSplitView(key, period, settings);

            // Assert
            expect(periodicNoteManager.createNote).toHaveBeenCalledWith(settings, period, DayOfWeek.Monday);
            expect(periodicNoteManager.openNoteInHorizontalSplitView).toHaveBeenCalledWith(settings, period, DayOfWeek.Monday);
        });

        it('should call the createNote and openNoteInHorizontalSplitView action if the settings do not require a modifier key if the note does not exist', async () => {
            // Arrange
            const key = ModifierKey.None;
            const settings = DEFAULT_DAILY_NOTE_SETTINGS;
            const generalSettings = <PluginSettings> {
                generalSettings: <GeneralSettings>{
                    useModifierKeyToCreateNote: false,
                    firstDayOfWeek: DayOfWeek.Monday,
                },
            };
            when(periodicNoteManager.doesNoteExist).calledWith(settings, period, DayOfWeek.Monday).mockReturnValue(false);

            // Act
            await service.initialize(generalSettings);
            await service.openNoteInHorizontalSplitView(key, period, settings);

            // Assert
            expect(periodicNoteManager.createNote).toHaveBeenCalledWith(settings, period, DayOfWeek.Monday);
            expect(periodicNoteManager.openNoteInHorizontalSplitView).toHaveBeenCalledWith(settings, period, DayOfWeek.Monday);
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
                    useModifierKeyToCreateNote: true,
                    firstDayOfWeek: DayOfWeek.Monday,
                },
            };

            // Act
            await service.initialize(generalSettings);
            await service.openNoteInVerticalSplitView(key, period, settings);

            // Assert
            expect(periodicNoteManager.createNote).toHaveBeenCalledWith(settings, period, DayOfWeek.Monday);
            expect(periodicNoteManager.openNoteInVerticalSplitView).toHaveBeenCalledWith(settings, period, DayOfWeek.Monday);
        });

        it('should only call the openNoteInVerticalSplitView action if settings require a modifier key and the modifier key is not pressed if the note exists', async () => {
            // Arrange
            const key = ModifierKey.None;
            const settings = DEFAULT_DAILY_NOTE_SETTINGS;
            const generalSettings = <PluginSettings> {
                generalSettings: <GeneralSettings>{
                    useModifierKeyToCreateNote: true,
                    firstDayOfWeek: DayOfWeek.Monday,
                },
            };
            when(periodicNoteManager.doesNoteExist).calledWith(settings, period, DayOfWeek.Monday).mockReturnValue(true);

            // Act
            await service.initialize(generalSettings);
            await service.openNoteInVerticalSplitView(key, period, settings);

            // Assert
            expect(periodicNoteManager.createNote).not.toHaveBeenCalled();
            expect(periodicNoteManager.openNoteInVerticalSplitView).toHaveBeenCalledWith(settings, period, DayOfWeek.Monday);
        });

        it('should not call the openNoteInVerticalSplitView action if settings require a modifier key and the modifier key is not pressed if the note does not exist', async () => {
            // Arrange
            const key = ModifierKey.None;
            const settings = DEFAULT_DAILY_NOTE_SETTINGS;
            const generalSettings = <PluginSettings> {
                generalSettings: <GeneralSettings>{
                    useModifierKeyToCreateNote: true,
                    firstDayOfWeek: DayOfWeek.Monday,
                },
            };
            when(periodicNoteManager.doesNoteExist).calledWith(settings, period, DayOfWeek.Monday).mockReturnValue(false);

            // Act
            await service.initialize(generalSettings);
            await service.openNoteInVerticalSplitView(key, period, settings);

            // Assert
            expect(periodicNoteManager.createNote).not.toHaveBeenCalled();
            expect(periodicNoteManager.openNoteInVerticalSplitView).not.toHaveBeenCalled();
        });

        it('should call the createNote and openNoteInVerticalSplitView action if the settings do not require a modifier key if the note exists', async () => {
            // Arrange
            const key = ModifierKey.None;
            const settings = DEFAULT_DAILY_NOTE_SETTINGS;
            const generalSettings = <PluginSettings> {
                generalSettings: <GeneralSettings>{
                    useModifierKeyToCreateNote: false,
                    firstDayOfWeek: DayOfWeek.Monday,
                },
            };
            when(periodicNoteManager.doesNoteExist).calledWith(settings, period, DayOfWeek.Monday).mockReturnValue(true);

            // Act
            await service.initialize(generalSettings);
            await service.openNoteInVerticalSplitView(key, period, settings);

            // Assert
            expect(periodicNoteManager.createNote).toHaveBeenCalledWith(settings, period, DayOfWeek.Monday);
            expect(periodicNoteManager.openNoteInVerticalSplitView).toHaveBeenCalledWith(settings, period, DayOfWeek.Monday);
        });

        it('should call the createNote and openNoteInVerticalSplitView action if the settings do not require a modifier key if the note does not exist', async () => {
            // Arrange
            const key = ModifierKey.None;
            const settings = DEFAULT_DAILY_NOTE_SETTINGS;
            const generalSettings = <PluginSettings> {
                generalSettings: <GeneralSettings>{
                    useModifierKeyToCreateNote: false,
                    firstDayOfWeek: DayOfWeek.Monday,
                },
            };
            when(periodicNoteManager.doesNoteExist).calledWith(settings, period, DayOfWeek.Monday).mockReturnValue(false);

            // Act
            await service.initialize(generalSettings);
            await service.openNoteInVerticalSplitView(key, period, settings);

            // Assert
            expect(periodicNoteManager.createNote).toHaveBeenCalledWith(settings, period, DayOfWeek.Monday);
            expect(periodicNoteManager.openNoteInVerticalSplitView).toHaveBeenCalledWith(settings, period, DayOfWeek.Monday);
        });
    });

    describe('deleteNote', () => {
        it('should call the manager with the default firstDayOfWeek when not initialized', async () => {
            // Arrange
            const settings = DEFAULT_DAILY_NOTE_SETTINGS;

            // Act
            await service.deleteNote(period, settings);

            // Assert — DEFAULT_PLUGIN_SETTINGS uses DayOfWeek.Monday
            expect(periodicNoteManager.deleteNote).toHaveBeenCalledWith(settings, period, DayOfWeek.Monday);
        });
    });

    describe('hasPeriodicNote', () => {
        it('should call the manager with the default firstDayOfWeek when not initialized', async () => {
            // Arrange
            const settings = DEFAULT_DAILY_NOTE_SETTINGS;

            // Act
            await service.hasPeriodicNote(period, settings);

            // Assert — DEFAULT_PLUGIN_SETTINGS uses DayOfWeek.Monday
            expect(periodicNoteManager.doesNoteExist).toHaveBeenCalledWith(settings, period, DayOfWeek.Monday);
        });
    });

    describe('effectiveWeekStartsOn', () => {
        afterEach(() => {
            jest.clearAllMocks();
        });

        it('should pass DayOfWeek.Monday to the manager when weekNumberStandard is ISO and firstDayOfWeek is Sunday', async () => {
            // Arrange — ISO week numbers are Monday-based; format(sunday, 'w', {weekStartsOn:0})
            // produces locale-Sunday week which is one ahead of ISO week. The service must
            // normalise to Monday so the note name matches the week number shown in the calendar.
            const settings = DEFAULT_DAILY_NOTE_SETTINGS;
            const generalSettings = <PluginSettings>{
                generalSettings: <GeneralSettings>{
                    firstDayOfWeek: DayOfWeek.Sunday,
                    weekNumberStandard: WeekNumberStandard.ISO,
                },
            };

            // Act
            await service.initialize(generalSettings);
            await service.deleteNote(period, settings);

            // Assert
            expect(periodicNoteManager.deleteNote).toHaveBeenCalledWith(settings, period, DayOfWeek.Monday);
        });

        it('should pass the configured firstDayOfWeek to the manager when weekNumberStandard is US', async () => {
            // Arrange — US week numbers respect the user's firstDayOfWeek directly.
            const settings = DEFAULT_DAILY_NOTE_SETTINGS;
            const generalSettings = <PluginSettings>{
                generalSettings: <GeneralSettings>{
                    firstDayOfWeek: DayOfWeek.Sunday,
                    weekNumberStandard: WeekNumberStandard.US,
                },
            };

            // Act
            await service.initialize(generalSettings);
            await service.deleteNote(period, settings);

            // Assert
            expect(periodicNoteManager.deleteNote).toHaveBeenCalledWith(settings, period, DayOfWeek.Sunday);
        });
    });
});