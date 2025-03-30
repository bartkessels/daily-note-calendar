import {mockPeriodicNoteManager} from 'src/test-helpers/manager.mocks';
import {PeriodNoteExistsPeriodEnhancer} from 'src/presentation/enhancers/period-note-exists.period-enhancer';
import {PeriodUiModel} from 'src/presentation/models/period.ui-model';
import {Period, PeriodType} from 'src/domain/models/period.model';
import {DEFAULT_PLUGIN_SETTINGS} from 'src/domain/settings/plugin.settings';

describe('PeriodNoteExistsPeriodEnhancer', () => {
    const periodicNoteManager = mockPeriodicNoteManager;
    const period = <PeriodUiModel> {
        period: <Period> {
            date: new Date(2023, 9, 2),
            name: '02',
            type: PeriodType.Day,
        },
        hasPeriodNote: false
    }

    let enhancer: PeriodNoteExistsPeriodEnhancer;

    beforeEach(() => {
        enhancer = new PeriodNoteExistsPeriodEnhancer(periodicNoteManager);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('withSettings', () => {
        it('should throw an exception when the settings have not been set', async () => {
            // Act
            const act = async () => await enhancer.enhance<PeriodUiModel>(period);

            // Assert
            await expect(act).rejects.toThrow('Settings not set');
        });

        it('should only enhance the uiModel when the settings have been set', async () => {
            // Arrange
            const settings = DEFAULT_PLUGIN_SETTINGS;

            // Act
            enhancer.withSettings(settings);
            const result = await enhancer.enhance<PeriodUiModel>(period);

            // Assert
            expect(result).not.toBeNull();
        });
    });

    describe('enhance', () => {
        it('should return the same ui model with hasPeriodNote set to true if the file exists', async () => {
            // Arrange
            const settings = DEFAULT_PLUGIN_SETTINGS;
            periodicNoteManager.doesNoteExist.mockResolvedValue(true);

            // Act
            enhancer.withSettings(settings);
            const result = await enhancer.enhance<PeriodUiModel>(period);

            // Assert
            expect(result).toEqual({
                ...period,
                hasPeriodNote: true
            });
        });

        it('should return the same ui model with hasPeriodNote set to false if the file does not exist', async () => {
            // Arrange
            const settings = DEFAULT_PLUGIN_SETTINGS;
            periodicNoteManager.doesNoteExist.mockResolvedValue(false);

            // Act
            enhancer.withSettings(settings);
            const result = await enhancer.enhance<PeriodUiModel>(period);

            // Assert
            expect(result).toEqual({
                ...period,
                hasPeriodNote: false
            });
        });

        it('should use the daily note settings for day type', async () => {
            // Arrange
            const settings = DEFAULT_PLUGIN_SETTINGS;
            const day = <PeriodUiModel> {
                ...period,
                period: <Period> {
                    ...period.period,
                    type: PeriodType.Day
                }
            };

            // Act
            enhancer.withSettings(settings);
            await enhancer.enhance<PeriodUiModel>(day);

            // Assert
            expect(periodicNoteManager.doesNoteExist).toHaveBeenCalledWith(settings.dailyNotes, day.period);
        });

        it('should use the weekly note settings for week type', async () => {
            // Arrange
            const settings = DEFAULT_PLUGIN_SETTINGS;
            const week = <PeriodUiModel> {
                ...period,
                period: <Period> {
                    ...period.period,
                    type: PeriodType.Week
                }
            };

            // Act
            enhancer.withSettings(settings);
            await enhancer.enhance<PeriodUiModel>(week);

            // Assert
            expect(periodicNoteManager.doesNoteExist).toHaveBeenCalledWith(settings.weeklyNotes, week.period);
        });

        it('should use the monthly note settings for month type', async () => {
            // Arrange
            const settings = DEFAULT_PLUGIN_SETTINGS;
            const month = <PeriodUiModel> {
                ...period,
                period: <Period> {
                    ...period.period,
                    type: PeriodType.Month
                }
            };

            // Act
            enhancer.withSettings(settings);
            await enhancer.enhance<PeriodUiModel>(month);

            // Assert
            expect(periodicNoteManager.doesNoteExist).toHaveBeenCalledWith(settings.monthlyNotes, month.period);
        });

        it('should use the quarterly note settings for quarter type', async () => {
            // Arrange
            const settings = DEFAULT_PLUGIN_SETTINGS;
            const quarter = <PeriodUiModel> {
                ...period,
                period: <Period> {
                    ...period.period,
                    type: PeriodType.Quarter
                }
            };

            // Act
            enhancer.withSettings(settings);
            await enhancer.enhance<PeriodUiModel>(quarter);

            // Assert
            expect(periodicNoteManager.doesNoteExist).toHaveBeenCalledWith(settings.quarterlyNotes, quarter.period);
        });

        it('should use the yearly note settings for year type', async () => {
            // Arrange
            const settings = DEFAULT_PLUGIN_SETTINGS;
            const year = <PeriodUiModel> {
                ...period,
                period: <Period> {
                    ...period.period,
                    type: PeriodType.Year
                }
            };

            // Act
            enhancer.withSettings(settings);
            await enhancer.enhance<PeriodUiModel>(year);

            // Assert
            expect(periodicNoteManager.doesNoteExist).toHaveBeenCalledWith(settings.yearlyNotes, year.period);
        });
    });
});