import {CalendarUiModelBuilder} from 'src/presentation/builders/calendar.ui-model.builder';
import {mockPeriodUiModelBuilder, mockWeekUiModelBuilder} from 'src/test-helpers/ui-model-builder.mocks';
import {DEFAULT_PLUGIN_SETTINGS, PluginSettings} from 'src/domain/settings/plugin.settings';
import {DayOfWeek, WeekModel} from 'src/domain/models/week.model';
import {Period, PeriodType} from 'src/domain/models/period.model';
import {when} from 'jest-when';
import {PeriodUiModel} from 'src/presentation/models/period.ui-model';
import {WeekUiModel} from 'src/presentation/models/week.ui-model';

describe('CalendarUiModelBuilder', () => {
    const weekBuilder = mockWeekUiModelBuilder;
    const periodBuilder = mockPeriodUiModelBuilder;

    let builder: CalendarUiModelBuilder;

    beforeEach(() => {
        builder = new CalendarUiModelBuilder(weekBuilder, periodBuilder);

        when(weekBuilder.withValue).mockReturnValue(weekBuilder);
        when(periodBuilder.withValue).mockReturnValue(periodBuilder);
        when(weekBuilder.build).mockResolvedValue([]);
    });

    afterEach(() => {
        jest.resetAllMocks();
    });

    describe('withSettings', () => {
        it('should set the settings on the week and period builder', () => {
            // Arrange
            const settings = DEFAULT_PLUGIN_SETTINGS;

            // Act
            builder.withSettings(settings);

            // Assert
            expect(weekBuilder.withSettings).toHaveBeenCalledWith(settings);
            expect(periodBuilder.withSettings).toHaveBeenCalledWith(settings);
        });

        it('should build the model when the settings are set', async () => {
            // Arrange
            const settings = DEFAULT_PLUGIN_SETTINGS;

            // Act
            builder.withSettings(settings);
            const result = await builder.build();

            // Assert
            expect(result).not.toBeNull();
        });

        it('should use the startWeekOnMonday value from the settings if it should start on a monday', async () => {
            // Arrange
            const startWeekOnMonday = true;
            const settings = <PluginSettings>{
                ...DEFAULT_PLUGIN_SETTINGS,
                generalSettings: {...DEFAULT_PLUGIN_SETTINGS.generalSettings, firstDayOfWeek: DayOfWeek.Monday}
            };

            // Act
            builder.withSettings(settings);
            const result = await builder.build();

            // Assert
            expect(result.startWeekOnMonday).toBe(startWeekOnMonday);
        });

        it('should use the startWeekOnMonday value from the settings if it should start on a sunday', async () => {
            // Arrange
            const startWeekOnMonday = false;
            const settings = <PluginSettings>{
                ...DEFAULT_PLUGIN_SETTINGS,
                generalSettings: {...DEFAULT_PLUGIN_SETTINGS.generalSettings, firstDayOfWeek: DayOfWeek.Sunday}
            };

            // Act
            builder.withSettings(settings);
            const result = await builder.build();

            // Assert
            expect(result.startWeekOnMonday).toBe(startWeekOnMonday);
        });

        it('should throw an exception when building the model when the settings are not set', async () => {
            // Act
            const act = async () => await builder.build();

            // Assert
            await expect(act).rejects.toThrow('Settings not set');
        });
    });

    describe('withSelectedPeriod', () => {
        const selectedPeriod = <Period>{
            date: new Date(2023, 9, 2),
            name: '2',
            type: PeriodType.Day
        };
        const selectedPeriodUiModel = <PeriodUiModel>{
            period: selectedPeriod,
            hasPeriodNote: false
        };

        beforeEach(() => {
            builder.withSettings(DEFAULT_PLUGIN_SETTINGS);
        });

        it('should not set the selected period when the period is not set', async () => {
            // Act
            const result = await builder.build();

            // Assert
            expect(periodBuilder.build).not.toHaveBeenCalled();
            expect(result.selectedPeriod).toBeNull();
        });

        it('should set the selected period to the given period', async () => {
            // Arrange
            when(periodBuilder.build).mockResolvedValue(selectedPeriodUiModel);

            // Act
            const result = await builder.withSelectedPeriod(selectedPeriod).build();

            // Assert
            expect(periodBuilder.withValue).toHaveBeenCalledWith(selectedPeriod);
            expect(periodBuilder.build).toHaveBeenCalled();
            expect(result.selectedPeriod).not.toBeUndefined();
            expect(result.selectedPeriod?.period).toEqual(selectedPeriod);
        });
    });

    describe('withToday', () => {
        const today = <Period>{
            date: new Date(2023, 9, 2),
            name: '2',
            type: PeriodType.Day
        };
        const todayUiModel = <PeriodUiModel>{
            period: today,
            hasPeriodNote: false
        };

        beforeEach(() => {
            builder.withSettings(DEFAULT_PLUGIN_SETTINGS);
        });

        it('should not set the today when the period is not set', async () => {
            // Act
            const result = await builder.build();

            // Assert
            expect(periodBuilder.build).not.toHaveBeenCalled();
            expect(result.selectedPeriod).toBeNull();
        });

        it('should set today to the given period', async () => {
            // Arrange
            when(periodBuilder.build).mockResolvedValue(todayUiModel);

            // Act
            const result = await builder.withToday(today).build();

            // Assert
            expect(periodBuilder.withValue).toHaveBeenCalledWith(today);
            expect(periodBuilder.build).toHaveBeenCalled();
            expect(result.today).not.toBeUndefined();
            expect(result.today?.period).toEqual(today);
        });
    });

    describe('withValue', () => {
        const year = <Period>{
            date: new Date(2023),
            name: '2023',
            type: PeriodType.Year
        };
        const quarter = <Period>{
            date: new Date(2023, 6),
            name: 'Q3',
            type: PeriodType.Quarter
        };
        const month = <Period>{
            date: new Date(2023, 9),
            name: 'October',
            type: PeriodType.Month
        };
        const weeks: WeekModel[] = [
            <WeekModel>{
                weekNumber: 40,
                year: year,
                month: month,
                quarter: quarter,
                date: new Date(2023, 9, 2),
                name: '40',
                type: PeriodType.Week,
                days: []
            },
            <WeekModel>{
                weekNumber: 41,
                year: year,
                month: month,
                quarter: quarter,
                date: new Date(2023, 9, 9),
                name: '41',
                type: PeriodType.Week,
                days: []
            }
        ];
        const weekUiModels = weeks.map(week => <WeekUiModel>{
            period: week,
            hasPeriodNote: false,
            weekNumber: week.weekNumber,
            year: <PeriodUiModel>{
                period: week.year,
                hasPeriodNote: false
            },
            quarter: <PeriodUiModel>{
                period: week.quarter,
                hasPeriodNote: false
            },
            month: <PeriodUiModel> {
                period: week.month,
                hasPeriodNote: false
            },
            days: []
        });

        beforeEach(() => {
            builder.withSettings(DEFAULT_PLUGIN_SETTINGS);
        });

        it('should have no weeks when the value has not been set', async () => {
            // Act
            const result = await builder.build();

            // Assert
            expect(weekBuilder.withValue).not.toHaveBeenCalled();
            expect(result.weeks).toEqual([]);
            expect(result.month).toBeUndefined();
            expect(result.year).toBeUndefined();
            expect(result.year).toBeUndefined();
        });

        it('should set the weeks to the given value', async () => {
            // Arrange
            when(weekBuilder.build).mockResolvedValue(weekUiModels);

            // Act
            const result = await builder.withValue(weeks).build();

            // Assert
            expect(weekBuilder.withValue).toHaveBeenCalledWith(weeks);
            expect(weekBuilder.build).toHaveBeenCalled();
            expect(result.weeks).toEqual(weekUiModels);
            expect(result.month).toEqual(weekUiModels[0].month);
            expect(result.quarter).toEqual(weekUiModels[0].quarter);
            expect(result.year).toEqual(weekUiModels[0].year);
        });
    });
});