import {mockPeriodService} from 'src/test-helpers/service.mocks';
import {YearPeriodNoteViewModel} from 'src/presentation/view-models/year.period-note-view-model';
import {DEFAULT_PLUGIN_SETTINGS, PluginSettings} from 'src/domain/settings/plugin.settings';
import {Period, PeriodType} from 'src/domain/models/period.model';
import {PeriodNoteSettings} from 'src/domain/settings/period-note.settings';
import { ModifierKey } from 'src/domain/models/modifier-key';
import {when} from 'jest-when';

describe('YearPeriodNoteViewModel', () => {
    const periodService = mockPeriodService;
    const period = <Period> {
        date: new Date(2023, 0),
        name: '2023',
        type: PeriodType.Year
    };

    let viewModel: YearPeriodNoteViewModel;

    beforeEach(() => {
        viewModel = new YearPeriodNoteViewModel(periodService);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('hasPeriodicNote', () => {
        it('uses the default settings if no other settings have been set', async () => {
            // Arrange
            const settings = DEFAULT_PLUGIN_SETTINGS;
            when(periodService.hasPeriodicNote).calledWith(period, settings.yearlyNotes).mockResolvedValue(true);

            // Act
            const result = await viewModel.hasPeriodicNote(period);

            // Assert
            expect(result).toEqual(true);
            expect(periodService.hasPeriodicNote)
                .toHaveBeenCalledWith(period, settings.yearlyNotes);
        });

        it('uses the custom settings if the settings have been set', async () => {
            const settings = <PluginSettings>{ ...DEFAULT_PLUGIN_SETTINGS,
                yearlyNotes: <PeriodNoteSettings> {
                    folder: 'path/to/year',
                    nameTemplate: 'Year',
                    templateFile: 'templates/year'
                }
            };
            when(periodService.hasPeriodicNote).calledWith(period, settings.yearlyNotes).mockResolvedValue(true);

            // Act
            viewModel.updateSettings(settings);
            const result = await viewModel.hasPeriodicNote(period);

            // Assert
            expect(result).toEqual(true);
            expect(periodService.hasPeriodicNote)
                .toHaveBeenCalledWith(period, settings.yearlyNotes);
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
                .toHaveBeenCalledWith(modifierKey, period, settings.yearlyNotes);
        });

        it('uses the custom settings if the settings have been set', async () => {
            const settings = <PluginSettings>{ ...DEFAULT_PLUGIN_SETTINGS,
                yearlyNotes: <PeriodNoteSettings> {
                    folder: 'path/to/year',
                    nameTemplate: 'Year',
                    templateFile: 'templates/year'
                }
            };
            const modifierKey = ModifierKey.Meta;

            // Act
            viewModel.updateSettings(settings);
            await viewModel.openNote(modifierKey, period);

            // Assert
            expect(periodService.openNoteInCurrentTab)
                .toHaveBeenCalledWith(modifierKey, period, settings.yearlyNotes);
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
                .toHaveBeenCalledWith(modifierKey, period, settings.yearlyNotes);
        });

        it('uses the custom settings if the settings have been set', async () => {
            const settings = <PluginSettings>{ ...DEFAULT_PLUGIN_SETTINGS,
                yearlyNotes: <PeriodNoteSettings> {
                    folder: 'path/to/year',
                    nameTemplate: 'Year',
                    templateFile: 'templates/year'
                }
            };
            const modifierKey = ModifierKey.Meta;

            // Act
            viewModel.updateSettings(settings);
            await viewModel.openNoteInHorizontalSplitView(modifierKey, period);

            // Assert
            expect(periodService.openNoteInHorizontalSplitView)
                .toHaveBeenCalledWith(modifierKey, period, settings.yearlyNotes);
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
                .toHaveBeenCalledWith(modifierKey, period, settings.yearlyNotes);
        });

        it('uses the custom settings if the settings have been set', async () => {
            const settings = <PluginSettings>{ ...DEFAULT_PLUGIN_SETTINGS,
                yearlyNotes: <PeriodNoteSettings> {
                    folder: 'path/to/year',
                    nameTemplate: 'Year',
                    templateFile: 'templates/year'
                }
            };
            const modifierKey = ModifierKey.None;

            // Act
            viewModel.updateSettings(settings);
            await viewModel.openNoteInVerticalSplitView(modifierKey, period);

            // Assert
            expect(periodService.openNoteInVerticalSplitView)
                .toHaveBeenCalledWith(modifierKey, period, settings.yearlyNotes);
        });
    });

    describe('deleteNote', () => {
        it('uses the default settings if no other settings have been set', async () => {
            // Arrange
            const settings = DEFAULT_PLUGIN_SETTINGS;

            // Act
            await viewModel.deleteNote(period);

            // Assert
            expect(periodService.deleteNote).toHaveBeenCalledWith(period, settings.yearlyNotes);
        });

        it('uses the custom settings if the settings have been set', async () => {
            const settings = <PluginSettings>{ ...DEFAULT_PLUGIN_SETTINGS,
                yearlyNotes: <PeriodNoteSettings> {
                    folder: 'path/to/year',
                    nameTemplate: 'Year',
                    templateFile: 'templates/year'
                }
            };

            // Act
            viewModel.updateSettings(settings);
            await viewModel.deleteNote(period);

            // Assert
            expect(periodService.deleteNote).toHaveBeenCalledWith(period, settings.yearlyNotes);
        });
    })
});