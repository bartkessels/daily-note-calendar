import {mockPeriodNoteExistsPeriodEnhancer} from 'src/test-helpers/enhancer.mocks';
import {PeriodUiModelBuilder} from 'src/presentation/builders/period.ui-model-builder';
import {DEFAULT_PLUGIN_SETTINGS} from 'src/domain/settings/plugin.settings';
import {Period, PeriodType} from 'src/domain/models/period.model';
import {when} from 'jest-when';
import {PeriodUiModel} from 'src/presentation/models/period.ui-model';

describe('PeriodUiModelBuilder', () => {
    const periodNoteExistsPeriodEnhancer = mockPeriodNoteExistsPeriodEnhancer;

    let builder: PeriodUiModelBuilder;

    beforeEach(() => {
        builder = new PeriodUiModelBuilder(periodNoteExistsPeriodEnhancer);
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
            expect(periodNoteExistsPeriodEnhancer.withSettings).toHaveBeenCalledWith(settings);
        });
    });

    describe('withValue', () => {
        it('should set the value and return the builder', () => {
            // Arrange
            const value = <any>{};

            // Act
            const result = builder.withValue(value);

            // Assert
            expect(result).toBe(builder);
        });
    });

    describe('build', () => {
        it('should throw an error if the value is not set', async () => {
            // Act
            const act = async () => await builder.build();

            // Assert
            await expect(act).rejects.toThrow('Value is required');
        });

        it('should build the period UI model', async () => {
            // Arrange
            const period = <Period>{
                date: new Date(2023, 9, 2),
                name: '02',
                type: PeriodType.Day
            };

            // Act
            when(periodNoteExistsPeriodEnhancer.enhance)
                .calledWith(<PeriodUiModel>{
                    period: period,
                    hasPeriodNote: false
                })
                .mockResolvedValue(<PeriodUiModel>{
                    period: period,
                    hasPeriodNote: true
                });

            const result = await builder.withValue(period).build();

            // Assert
            expect(result).not.toBeNull();
            expect(result.period).toEqual(period);
            expect(result.hasPeriodNote).toBe(true);
        });
    });
});