import {mockPeriodNoteExistsPeriodEnhancer} from 'src/test-helpers/enhancer.mocks';
import {mockPeriodUiModelBuilder} from 'src/test-helpers/ui-model-builder.mocks';
import {WeekUiModelBuilder} from 'src/presentation/builders/week.ui-model-builder';
import {DEFAULT_PLUGIN_SETTINGS} from 'src/domain/settings/plugin.settings';
import {WeekModel} from 'src/domain/models/week.model';
import {Period, PeriodType} from 'src/domain/models/period.model';
import {when} from 'jest-when';
import {PeriodUiModel} from 'src/presentation/models/period.ui-model';

describe('WeekUiModelBuilder', () => {
    const periodEnhancer = mockPeriodNoteExistsPeriodEnhancer;
    const periodUiModelBuilder = mockPeriodUiModelBuilder;

    let builder: WeekUiModelBuilder;

    beforeEach(() => {
        builder = new WeekUiModelBuilder(periodEnhancer, periodUiModelBuilder);

        when(periodUiModelBuilder.withValue).mockReturnValue(periodUiModelBuilder);
    });

    afterEach(() => {
        jest.resetAllMocks();
    });

    describe('withSettings', () => {
        it('should set the settings on the period enhancer', () => {
            // Arrange
            const settings = DEFAULT_PLUGIN_SETTINGS;

            // Act
            builder.withSettings(settings);

            // Assert
            expect(periodEnhancer.withSettings).toHaveBeenCalledWith(settings);
        });

        it('should set the settings on the period UI model builder', () => {
            // Arrange
            const settings = DEFAULT_PLUGIN_SETTINGS;

            // Act
            builder.withSettings(settings);

            // Assert
            expect(periodUiModelBuilder.withSettings).toHaveBeenCalledWith(settings);
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

        beforeEach(() => {
            periodEnhancer.enhance.mockImplementation(async w => w);
        });

        it('should build the year UI model', async () => {
            // Arrange
            const expected = <PeriodUiModel> {
                period: year,
                hasPeriodNote: false
            };

            when(periodUiModelBuilder.build).mockResolvedValue(expected);

            // Act
            const result = await builder.withValue(weeks).build();

            // Assert
            expect(periodUiModelBuilder.withValue).toHaveBeenCalledWith(year);
            expect(periodUiModelBuilder.build).toHaveBeenCalled();
            expect(result[0].year).toEqual(expected);
        });

        it('should build the quarter UI model', async () => {
            // Arrange
            const expected = <PeriodUiModel> {
                period: quarter,
                hasPeriodNote: false
            };

            when(periodUiModelBuilder.build).mockResolvedValue(expected);

            // Act
            const result = await builder.withValue(weeks).build();

            // Assert
            expect(periodUiModelBuilder.withValue).toHaveBeenCalledWith(year);
            expect(periodUiModelBuilder.build).toHaveBeenCalled();
            expect(result[0].quarter).toEqual(expected);
        });

        it('should build the month UI model', async () => {
            // Arrange
            const expected = <PeriodUiModel> {
                period: month,
                hasPeriodNote: false
            };

            when(periodUiModelBuilder.build).mockResolvedValue(expected);

            // Act
            const result = await builder.withValue(weeks).build();

            // Assert
            expect(periodUiModelBuilder.withValue).toHaveBeenCalledWith(year);
            expect(periodUiModelBuilder.build).toHaveBeenCalled();
            expect(result[0].month).toEqual(expected);
        });

        it('should build the days UI model', async () => {
            // Arrange
            const day = <Period>{
                date: new Date(2023, 9, 2),
                name: '2',
                type: PeriodType.Day
            };
            const days = [day];
            const week = <WeekModel> {
                ...weeks[0],
                days: days
            };

            when(periodUiModelBuilder.build).mockResolvedValue(<PeriodUiModel> {
                period: day,
                hasPeriodNote: false
            });

            // Act
            const result = await builder.withValue([week]).build();

            // Assert
            expect(periodUiModelBuilder.withValue).toHaveBeenCalledWith(day);
            expect(periodUiModelBuilder.build).toHaveBeenCalled();
            expect(result[0].days[0].period).toEqual(day);
            expect(result[0].days[0].hasPeriodNote).toEqual(false);
        });

        it('should build empty day UI models when there are no days', async () => {
            // Arrange
            const week = <WeekModel> {
                ...weeks[0],
                days: []
            };

            // Act
            const result = await builder.withValue([week]).build();

            // Assert
            expect(result[0].days).toEqual([]);
        });
    });
});