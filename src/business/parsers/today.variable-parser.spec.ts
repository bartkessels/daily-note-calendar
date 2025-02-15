import {mockDateParserFactory, mockVariableFactory} from 'src/test-helpers/factory.mocks';
import {mockDateParser} from 'src/test-helpers/parser.mocks';
import {Variable, VariableType} from 'src/domain/models/variable.model';
import {when} from 'jest-when';
import {TodayVariableParser} from 'src/business/parsers/today.variable-parser';

describe('TodayVariableParser', () => {
    let parser: TodayVariableParser;

    const variableFactory = mockVariableFactory();
    const dateParser = mockDateParser;

    beforeEach(() => {
        const dateParserFactory = mockDateParserFactory(dateParser);
        parser = new TodayVariableParser(variableFactory, dateParserFactory);
    });

    describe('parseVariables', () => {
        it('should replace {{today:yyyy-MM-dd}} with the given period date', () => {
            // Arrange
            const variable = <Variable> {
                name: 'today',
                type: VariableType.Today,
                template: 'yyyy-MM-dd',
                calculus: null
            };
            const date = new Date('2024-12-31');
            const content = `Today's date is {{today:${variable.template}}}.`;

            when(variableFactory.getVariable).mockReturnValue(variable);
            when(dateParser.fromDate).calledWith(date, variable.template!).mockReturnValue('2024-12-31');

            // Act
            const result = parser.parseVariables(content, date);

            // Assert
            expect(result).toBe(`Today's date is 2024-12-31.`);
        });

        it('should get the calculated date if calculus is present', () => {
            // Arrange
            const variable = <Variable> {
                name: 'today',
                type: VariableType.Today,
                template: 'yyyy-MM-dd',
                calculus: {
                    operator: '+',
                    value: 1,
                    unit: 'd'
                }
            };
            const date = new Date('2024-12-31');
            const content = `Today's date is {{today:${variable.template}}}.`;

            when(variableFactory.getVariable).mockReturnValue(variable);
            when(dateParser.fromDate).calledWith(new Date('2025-01-01'), variable.template!).mockReturnValue('2025-01-01');

            // Act
            const result = parser.parseVariables(content, date);

            // Assert
            expect(result).toBe(`Today's date is 2025-01-01.`);
        });
    });
});