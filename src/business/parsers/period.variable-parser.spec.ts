import {PeriodVariableParser} from 'src/business/parsers/period.variable-parser';
import {mockDateParserFactory, mockVariableFactory} from 'src/test-helpers/factory.mocks';
import {mockDateParser} from 'src/test-helpers/parser.mocks';
import {Period, PeriodType} from 'src/domain/models/period.model';
import {Variable, VariableType} from 'src/domain/models/variable.model';
import {when} from 'jest-when';

describe('PeriodVariableParser', () => {
    let parser: PeriodVariableParser;

    const variableFactory = mockVariableFactory();
    const dateParser = mockDateParser;

    beforeEach(() => {
        const dateParserFactory = mockDateParserFactory(dateParser);
        parser = new PeriodVariableParser(variableFactory, dateParserFactory);
    });

    describe('parseVariables', () => {
        it('should replace {{date:yyyy-MM-dd}} with the given period date', () => {
            // Arrange
            const variable = <Variable> {
                name: 'date',
                type: VariableType.Date,
                template: 'yyyy-MM-dd',
                calculus: null
            };
            const period = <Period> {
                date: new Date('2024-12-31'),
                name: '31',
                type: PeriodType.Day
            };
            const content = `Period's date is {{date:${variable.template}}}.`;

            when(variableFactory.getVariable).mockReturnValue(variable);
            when(dateParser.fromDate).calledWith(period.date, variable.template!).mockReturnValue('2024-12-31');

            // Act
            const result = parser.parseVariables(content, period);

            // Assert
            expect(result).toBe(`Period's date is 2024-12-31.`);
        });

        it('should get the calculated date if calculus is present', () => {
            // Arrange
            const variable = <Variable> {
                name: 'date',
                type: VariableType.Date,
                template: 'yyyy-MM-dd',
                calculus: {
                    operator: '+',
                    value: 1,
                    unit: 'd'
                }
            };
            const period = <Period> {
                date: new Date('2024-12-31'),
                name: '31',
                type: PeriodType.Day
            };
            const content = `Period's date is {{date:${variable.template}}}.`;

            when(variableFactory.getVariable).mockReturnValue(variable);
            when(dateParser.fromDate).calledWith(new Date('2025-01-01'), variable.template!).mockReturnValue('2025-01-01');

            // Act
            const result = parser.parseVariables(content, period);

            // Assert
            expect(result).toBe(`Period's date is 2025-01-01.`);
        });
    });
});