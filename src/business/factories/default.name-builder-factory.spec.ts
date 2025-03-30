import {DefaultNameBuilderFactory} from 'src/business/factories/default.name-builder-factory';
import {NameBuilderType} from 'src/business/contracts/name-builder-factory';
import {PeriodNameBuilder} from 'src/business/builders/period.name-builder';
import {Period} from 'src/domain/models/period.model';
import {mockDateParserFactory} from 'src/test-helpers/factory.mocks';

describe('DefaultNameBuilderFactory', () => {
    let factory: DefaultNameBuilderFactory;

    beforeEach(() => {
        const dateParserFactory = mockDateParserFactory();
        factory = new DefaultNameBuilderFactory(dateParserFactory);
    });

    describe('getNameBuilder', () => {
        it('should return the period name builder for the PeriodicNote type', () => {
            // Arrange
            const type = NameBuilderType.PeriodicNote;

            // Act
            const result = factory.getNameBuilder<Period>(type);

            // Assert
            expect(result).toBeInstanceOf(PeriodNameBuilder);
        });
    });
});