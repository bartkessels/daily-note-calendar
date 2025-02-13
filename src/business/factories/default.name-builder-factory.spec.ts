import {DefaultNameBuilderFactory} from 'src/business/factories/default.name-builder-factory';
import {DateParserFactory} from 'src/infrastructure/contracts/date-parser-factory';
import {DateParser} from 'src/infrastructure/contracts/date-parser';
import {NameBuilderType} from 'src/business/contracts/name-builder-factory';
import {PeriodNameBuilder} from 'src/business/builders/period.name-builder';
import {Period} from 'src/domain/models/period.model';

describe('DefaultNameBuilderFactory', () => {
    let factory: DefaultNameBuilderFactory;
    let dateParserFactory = {
        getParser: jest.fn()
    } as jest.Mocked<DateParserFactory>;

    beforeEach(() => {
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