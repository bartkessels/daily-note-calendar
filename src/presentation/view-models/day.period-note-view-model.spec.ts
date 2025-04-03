import {mockPeriodService} from 'src/test-helpers/service.mocks';
import {DayPeriodNoteViewModel} from 'src/presentation/view-models/day.period-note-view-model';
import {DEFAULT_PLUGIN_SETTINGS, PluginSettings} from 'src/domain/settings/plugin.settings';
import {Period, PeriodType} from 'src/domain/models/period.model';
import {PeriodNoteSettings} from 'src/domain/settings/period-note.settings';
import { ModifierKey } from 'src/domain/models/modifier-key';
import {when} from 'jest-when';

describe('DayPeriodNoteViewModel', () => {
    const periodService = mockPeriodService;
    const period = <Period> {
        date: new Date(2023, 9),
        name: 'October',
        type: PeriodType.Day
    };

    let viewModel: DayPeriodNoteViewModel;

    beforeEach(() => {
        viewModel = new DayPeriodNoteViewModel(periodService);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('hasPeriodicNote', () => {
        it('uses the default settings if no other settings have been set', async () => {
            // Arrange
            const settings = DEFAULT_PLUGIN_SETTINGS;
            when(periodService.hasPeriodicNote).calledWith(period, settings.dailyNotes).mockResolvedValue(true);

            // Act
            const result = await viewModel.hasPeriodicNote(period);

            // Assert
            expect(result).toEqual(true);
            expect(periodService.hasPeriodicNote)
                .toHaveBeenCalledWith(period, settings.dailyNotes);
        });

        it('uses the custom settings if the settings have been set', async () => {
            const settings = <PluginSettings>{ ...DEFAULT_PLUGIN_SETTINGS,
                dailyNotes: <PeriodNoteSettings> {
                    folder: 'path/to/day',
                    nameTemplate: 'Day',
                    templateFile: 'templates/day'
                }
            };
            when(periodService.hasPeriodicNote).calledWith(period, settings.dailyNotes).mockResolvedValue(true);

            // Act
            viewModel.updateSettings(settings);
            const result = await viewModel.hasPeriodicNote(period);

            // Assert
            expect(result).toEqual(true);
            expect(periodService.hasPeriodicNote)
                .toHaveBeenCalledWith(period, settings.dailyNotes);
        });
    });

    describe('openNote', () => {
        it('uses the default settings if no other settings have been set', async () => {
            // Arrange
            const settings = DEFAULT_PLUGIN_SETTINGS;
            const modifierKey = ModifierKey.None;

            // Act
            await viewModel.openNote(modifierKey, period);

            // Assert
            expect(periodService.openNoteInCurrentTab)
                .toHaveBeenCalledWith(modifierKey, period, settings.dailyNotes);
        });

        it('uses the custom settings if the settings have been set', async () => {
            const settings = <PluginSettings>{ ...DEFAULT_PLUGIN_SETTINGS,
                dailyNotes: <PeriodNoteSettings> {
                    folder: 'path/to/day',
                    nameTemplate: 'Day',
                    templateFile: 'templates/day'
                }
            };
            const modifierKey = ModifierKey.Meta;

            // Act
            viewModel.updateSettings(settings);
            await viewModel.openNote(modifierKey, period);

            // Assert
            expect(periodService.openNoteInCurrentTab)
                .toHaveBeenCalledWith(modifierKey, period, settings.dailyNotes);
        });
    });

    describe('openNoteInHorizontalSplitView', () => {
        it('uses the default settings if no other settings have been set', async () => {
            // Arrange
            const settings = DEFAULT_PLUGIN_SETTINGS;
            const modifierKey = ModifierKey.None;

            // Act
            await viewModel.openNoteInHorizontalSplitView(modifierKey, period);

            // Assert
            expect(periodService.openNoteInHorizontalSplitView)
                .toHaveBeenCalledWith(modifierKey, period, settings.dailyNotes);
        });

        it('uses the custom settings if the settings have been set', async () => {
            const settings = <PluginSettings>{ ...DEFAULT_PLUGIN_SETTINGS,
                dailyNotes: <PeriodNoteSettings> {
                    folder: 'path/to/day',
                    nameTemplate: 'Day',
                    templateFile: 'templates/day'
                }
            };
            const modifierKey = ModifierKey.Meta;

            // Act
            viewModel.updateSettings(settings);
            await viewModel.openNoteInHorizontalSplitView(modifierKey, period);

            // Assert
            expect(periodService.openNoteInHorizontalSplitView)
                .toHaveBeenCalledWith(modifierKey, period, settings.dailyNotes);
        });
    });

    describe('openNoteInVerticalSplitView', () => {
        it('uses the default settings if no other settings have been set', async () => {
            // Arrange
            const settings = DEFAULT_PLUGIN_SETTINGS;
            const modifierKey = ModifierKey.Alt;

            // Act
            await viewModel.openNoteInVerticalSplitView(modifierKey, period);

            // Assert
            expect(periodService.openNoteInVerticalSplitView)
                .toHaveBeenCalledWith(modifierKey, period, settings.dailyNotes);
        });

        it('uses the custom settings if the settings have been set', async () => {
            const settings = <PluginSettings>{ ...DEFAULT_PLUGIN_SETTINGS,
                dailyNotes: <PeriodNoteSettings> {
                    folder: 'path/to/day',
                    nameTemplate: 'Day',
                    templateFile: 'templates/day'
                }
            };
            const modifierKey = ModifierKey.None;

            // Act
            viewModel.updateSettings(settings);
            await viewModel.openNoteInVerticalSplitView(modifierKey, period);

            // Assert
            expect(periodService.openNoteInVerticalSplitView)
                .toHaveBeenCalledWith(modifierKey, period, settings.dailyNotes);
        });
    });

    describe('deleteNote', () => {
        it('uses the default settings if no other settings have been set', async () => {
            // Arrange
            const settings = DEFAULT_PLUGIN_SETTINGS;

            // Act
            await viewModel.deleteNote(period);

            // Assert
            expect(periodService.deleteNote).toHaveBeenCalledWith(period, settings.dailyNotes);
        });

        it('uses the custom settings if the settings have been set', async () => {
            const settings = <PluginSettings>{ ...DEFAULT_PLUGIN_SETTINGS,
                dailyNotes: <PeriodNoteSettings> {
                    folder: 'path/to/day',
                    nameTemplate: 'Day',
                    templateFile: 'templates/day'
                }
            };

            // Act
            viewModel.updateSettings(settings);
            await viewModel.deleteNote(period);

            // Assert
            expect(periodService.deleteNote).toHaveBeenCalledWith(period, settings.dailyNotes);
        });
    })
});