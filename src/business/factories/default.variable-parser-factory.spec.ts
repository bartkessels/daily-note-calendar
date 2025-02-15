import {DefaultVariableParserFactory} from 'src/business/factories/default.variable-parser-factory';
import {VariableType} from 'src/domain/models/variable.model';
import { ActiveFileVariableParser } from 'src/business/parsers/active-file.variable-parser';
import {Period} from 'src/domain/models/period.model';
import {PeriodVariableParser} from 'src/business/parsers/period.variable-parser';
import {TodayVariableParser} from 'src/business/parsers/today.variable-parser';
import {mockDateParserFactory, mockVariableFactory} from 'src/test-helpers/factory.mocks';

describe('DefaultVariableParserFactory', () => {
    let factory: DefaultVariableParserFactory;

    beforeEach(() => {
        const variableFactory = mockVariableFactory();
        const dateParserFactory = mockDateParserFactory();

        factory = new DefaultVariableParserFactory(variableFactory, dateParserFactory);
    });

    describe('getVariableParser', () => {
        it('should return the ActiveFileVariableParser for the Title type', () => {
            // Arrange
            const type = VariableType.Title;

            // Act
            const result = factory.getVariableParser<string>(type);

            // Assert
            expect(result).toBeInstanceOf(ActiveFileVariableParser);
        });

        it('should return the PeriodVariableParser for the Date type', () => {
            // Arrange
            const type = VariableType.Date;

            // Act
            const result = factory.getVariableParser<Period>(type);

            // Assert
            expect(result).toBeInstanceOf(PeriodVariableParser);
        });

        it('should return the TodayVariableParser for the Today type', () => {
            // Arrange
            const type = VariableType.Today;

            // Act
            const result = factory.getVariableParser<Date>(type);

            // Assert
            expect(result).toBeInstanceOf(TodayVariableParser);
        });
    });
});