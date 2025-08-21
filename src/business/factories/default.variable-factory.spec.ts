import {DefaultVariableFactory} from 'src/business/factories/default.variable-factory';
import {CalculusOperator, VariableType} from 'src/domain/models/variable.model';

describe('DefaultVariableFactory', () => {
    const factory = new DefaultVariableFactory();

    describe('getVariable', () => {
        describe('type is unknown', () => {
            it('should throw an exception', () => {
                // Arrange
                const value = '{{unknown}}';

                // Act
                const result = () => factory.getVariable(value);

                // Assert
                expect(() => result()).toThrow('The variable "{{unknown}}" is not supported.');
            });
        });

        describe('type is date', () => {
            it('should throw an exception if it has no template', () => {
                // Arrange
                const value = '{{date}}';

                // Act
                const result = () => factory.getVariable(value);

                // Assert
                expect(() => result()).toThrow('Could not parse all variables: The variable "{{date}}" requires a template, but none was provided.');
            });

            it('should return the variable without calculus if it has no calculus operator', () => {
                // Arrange
                const value = '{{date:yyyy-MM-dd}}';

                // Act
                const result = factory.getVariable(value);

                // Assert
                expect(result.type).toBe(VariableType.Date);
                expect(result.template).toBe('yyyy-MM-dd');
                expect(result.calculus).toBeNull();
            });

            it('should return the variable with the correct calculus operator for adding two days', () => {
                // Arrange
                const value = '{{date+2d:yyyy-MM-dd}}';

                // Act
                const result = factory.getVariable(value);

                // Assert
                expect(result.type).toBe(VariableType.Date);
                expect(result.template).toBe('yyyy-MM-dd');
                expect(result.calculus).not.toBeNull();
                expect(result.calculus?.operator).toBe(CalculusOperator.Add);
                expect(result.calculus?.unit).toBe('d');
                expect(result.calculus?.value).toBe(2);
            });

            it('should return the variable with the correct calculus operator for subtracting three months', () => {
                // Arrange
                const value = '{{date-3m:yyyy-MM-dd}}';

                // Act
                const result = factory.getVariable(value);

                // Assert
                expect(result.type).toBe(VariableType.Date);
                expect(result.template).toBe('yyyy-MM-dd');
                expect(result.calculus).not.toBeNull();
                expect(result.calculus?.operator).toBe(CalculusOperator.Subtract);
                expect(result.calculus?.unit).toBe('m');
                expect(result.calculus?.value).toBe(3);
            });
        });

        describe('type is today', () => {
            it('should throw an exception if it has no template', () => {
                // Arrange
                const value = '{{today}}';

                // Act
                const result = () => factory.getVariable(value);

                // Assert
                expect(() => result()).toThrow('Could not parse all variables: The variable "{{today}}" requires a template, but none was provided.');
            });

            it('should return the variable without calculus if it has no calculus operator', () => {
                // Arrange
                const value = '{{today:yyyy-MM-dd}}';

                // Act
                const result = factory.getVariable(value);

                // Assert
                expect(result.type).toBe(VariableType.Today);
                expect(result.template).toBe('yyyy-MM-dd');
                expect(result.calculus).toBeNull();
            });

            it('should return the variable with the correct calculus operator for adding two days', () => {
                // Arrange
                const value = '{{today+2d:yyyy-MM-dd}}';

                // Act
                const result = factory.getVariable(value);

                // Assert
                expect(result.type).toBe(VariableType.Today);
                expect(result.template).toBe('yyyy-MM-dd');
                expect(result.calculus).not.toBeNull();
                expect(result.calculus?.operator).toBe(CalculusOperator.Add);
                expect(result.calculus?.unit).toBe('d');
                expect(result.calculus?.value).toBe(2);
            });

            it('should return the variable with the correct calculus operator for subtracting three months', () => {
                // Arrange
                const value = '{{today-3m:yyyy-MM-dd}}';

                // Act
                const result = factory.getVariable(value);

                // Assert
                expect(result.type).toBe(VariableType.Today);
                expect(result.template).toBe('yyyy-MM-dd');
                expect(result.calculus).not.toBeNull();
                expect(result.calculus?.operator).toBe(CalculusOperator.Subtract);
                expect(result.calculus?.unit).toBe('m');
                expect(result.calculus?.value).toBe(3);
            });
        });

        describe('type is title', () => {
            it('should return the variable', () => {
                // Arrange
                const value = '{{title}}';

                // Act
                const result = factory.getVariable(value);

                // Assert
                expect(result.type).toBe(VariableType.Title);
                expect(result.template).toBeNull();
                expect(result.calculus).toBeNull();
            });

            it('should not parse the calculus', () => {
                // Arrange
                const value = '{{title+2d}}';

                // Act
                const result = factory.getVariable(value);

                // Assert
                expect(result.type).toBe(VariableType.Title);
                expect(result.template).toBeNull();
                expect(result.calculus).toBeNull();
            });
        });
    });
});