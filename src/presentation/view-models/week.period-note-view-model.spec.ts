import {mockPeriodService} from 'src/test-helpers/service.mocks';
import {WeekPeriodNoteViewModel} from 'src/presentation/view-models/week.period-note-view-model';
import {DEFAULT_PLUGIN_SETTINGS, PluginSettings} from 'src/domain/settings/plugin.settings';
import {PeriodType} from 'src/domain/models/period.model';
import {PeriodNoteSettings} from 'src/domain/settings/period-note.settings';
import { ModifierKey } from 'src/domain/models/modifier-key';
import {when} from 'jest-when';
import {Week} from 'src/domain/models/week';

describe('WeekPeriodNoteViewModel', () => {
    const periodService = mockPeriodService;
    const period = <Week> {
        date: new Date(2023, 9, 2),
        weekNumber: 40,
        name: '40',
        type: PeriodType.Week
    };

    let viewModel: WeekPeriodNoteViewModel;

    beforeEach(() => {
        viewModel = new WeekPeriodNoteViewModel(periodService);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('hasPeriodicNote', () => {
        it('uses the default settings if no other settings have been set', async () => {
            // Arrange
            const settings = DEFAULT_PLUGIN_SETTINGS;
            when(periodService.hasPeriodicNote).calledWith(period, settings.weeklyNotes).mockResolvedValue(true);

            // Act
            const result = await viewModel.hasPeriodicNote(period);

            // Assert
            expect(result).toEqual(true);
            expect(periodService.hasPeriodicNote)
                .toHaveBeenCalledWith(period, settings.weeklyNotes);
        });

        it('uses the custom settings if the settings have been set', async () => {
            const settings = <PluginSettings>{ ...DEFAULT_PLUGIN_SETTINGS,
                weeklyNotes: <PeriodNoteSettings> {
                    folder: 'path/to/week',
                    nameTemplate: 'Week',
                    templateFile: 'templates/week'
                }
            };
            when(periodService.hasPeriodicNote).calledWith(period, settings.weeklyNotes).mockResolvedValue(true);

            // Act
            viewModel.updateSettings(settings);
            const result = await viewModel.hasPeriodicNote(period);

            // Assert
            expect(result).toEqual(true);
            expect(periodService.hasPeriodicNote)
                .toHaveBeenCalledWith(period, settings.weeklyNotes);
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
                .toHaveBeenCalledWith(modifierKey, period, settings.weeklyNotes);
        });

        it('uses the custom settings if the settings have been set', async () => {
            const settings = <PluginSettings>{ ...DEFAULT_PLUGIN_SETTINGS,
                weeklyNotes: <PeriodNoteSettings> {
                    folder: 'path/to/week',
                    nameTemplate: 'Week',
                    templateFile: 'templates/week'
                }
            };
            const modifierKey = ModifierKey.Meta;

            // Act
            viewModel.updateSettings(settings);
            await viewModel.openNote(modifierKey, period);

            // Assert
            expect(periodService.openNoteInCurrentTab)
                .toHaveBeenCalledWith(modifierKey, period, settings.weeklyNotes);
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
                .toHaveBeenCalledWith(modifierKey, period, settings.weeklyNotes);
        });

        it('uses the custom settings if the settings have been set', async () => {
            const settings = <PluginSettings>{ ...DEFAULT_PLUGIN_SETTINGS,
                weeklyNotes: <PeriodNoteSettings> {
                    folder: 'path/to/week',
                    nameTemplate: 'Week',
                    templateFile: 'templates/week'
                }
            };
            const modifierKey = ModifierKey.Meta;

            // Act
            viewModel.updateSettings(settings);
            await viewModel.openNoteInHorizontalSplitView(modifierKey, period);

            // Assert
            expect(periodService.openNoteInHorizontalSplitView)
                .toHaveBeenCalledWith(modifierKey, period, settings.weeklyNotes);
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
                .toHaveBeenCalledWith(modifierKey, period, settings.weeklyNotes);
        });

        it('uses the custom settings if the settings have been set', async () => {
            const settings = <PluginSettings>{ ...DEFAULT_PLUGIN_SETTINGS,
                weeklyNotes: <PeriodNoteSettings> {
                    folder: 'path/to/week',
                    nameTemplate: 'Week',
                    templateFile: 'templates/week'
                }
            };
            const modifierKey = ModifierKey.None;

            // Act
            viewModel.updateSettings(settings);
            await viewModel.openNoteInVerticalSplitView(modifierKey, period);

            // Assert
            expect(periodService.openNoteInVerticalSplitView)
                .toHaveBeenCalledWith(modifierKey, period, settings.weeklyNotes);
        });
    });

    describe('deleteNote', () => {
        it('uses the default settings if no other settings have been set', async () => {
            // Arrange
            const settings = DEFAULT_PLUGIN_SETTINGS;

            // Act
            await viewModel.deleteNote(period);

            // Assert
            expect(periodService.deleteNote).toHaveBeenCalledWith(period, settings.weeklyNotes);
        });

        it('uses the custom settings if the settings have been set', async () => {
            const settings = <PluginSettings>{ ...DEFAULT_PLUGIN_SETTINGS,
                weeklyNotes: <PeriodNoteSettings> {
                    folder: 'path/to/week',
                    nameTemplate: 'Week',
                    templateFile: 'templates/week'
                }
            };

            // Act
            viewModel.updateSettings(settings);
            await viewModel.deleteNote(period);

            // Assert
            expect(periodService.deleteNote).toHaveBeenCalledWith(period, settings.weeklyNotes);
        });
    })
});