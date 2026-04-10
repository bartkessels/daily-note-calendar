import {DefaultVariableFactory} from 'src/business/factories/default.variable-factory';
import {CalculusOperator, VariableType} from 'src/domain/models/variable.model';

describe('DefaultVariableFactory', () => {
    let factory: DefaultVariableFactory;

    beforeEach(() => {
        factory = new DefaultVariableFactory();
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

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

        describe('invalid variable format', () => {
            it('should handle invalid format that does not match regex', () => {
                // Arrange
                const value = 'not-a-variable';

                // Act & Assert
                expect(() => factory.getVariable(value)).toThrow();
            });

            it('should handle malformed variable brackets', () => {
                // Arrange
                const value = '{{invalid';

                // Act & Assert
                expect(() => factory.getVariable(value)).toThrow();
            });

            it('should throw an error when no value is given', () => {
                // Arrange
                const value = '';

                // Act & Assert
                expect(() => factory.getVariable(value)).toThrow('Could not extract any variable from \'\'');
            });

            it('should throw error mentioning undefined when regex completely fails', () => {
                // Arrange
                const value = 'completely invalid format';

                // Act & Assert
                expect(() => factory.getVariable(value)).toThrow(`Could not extract any variable from '${value}'`);
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

        describe('calculus edge cases', () => {
            describe('multi-digit calculus values', () => {
                it('should correctly parse adding 10 days', () => {
                    // Arrange
                    const value = '{{date+10d:yyyy-MM-dd}}';

                    // Act
                    const result = factory.getVariable(value);

                    // Assert
                    expect(result.calculus).not.toBeNull();
                    expect(result.calculus?.operator).toBe(CalculusOperator.Add);
                    expect(result.calculus?.unit).toBe('d');
                    expect(result.calculus?.value).toBe(10);
                });

                it('should correctly parse adding 100 years', () => {
                    // Arrange
                    const value = '{{date+100y:yyyy-MM-dd}}';

                    // Act
                    const result = factory.getVariable(value);

                    // Assert
                    expect(result.calculus).not.toBeNull();
                    expect(result.calculus?.operator).toBe(CalculusOperator.Add);
                    expect(result.calculus?.unit).toBe('y');
                    expect(result.calculus?.value).toBe(100);
                });

                it('should correctly parse subtracting 99 months', () => {
                    // Arrange
                    const value = '{{today-99m:yyyy-MM-dd}}';

                    // Act
                    const result = factory.getVariable(value);

                    // Assert
                    expect(result.calculus).not.toBeNull();
                    expect(result.calculus?.operator).toBe(CalculusOperator.Subtract);
                    expect(result.calculus?.unit).toBe('m');
                    expect(result.calculus?.value).toBe(99);
                });
            });

            describe('invalid calculus format', () => {
                it('should return null calculus for string with only operator and unit', () => {
                    // Arrange
                    const value = '{{date+-d:yyyy-MM-dd}}';

                    // Act
                    const result = factory.getVariable(value);

                    // Assert
                    expect(result.calculus).toBeNull();
                });

                it('should return null calculus for completely invalid calculus string', () => {
                    // Arrange
                    const value = '{{date+abc:yyyy-MM-dd}}';

                    // Act
                    const result = factory.getVariable(value);

                    // Assert
                    // This verifies the fallback array [] in getCalculusFromRegex line 37
                    // When regex.exec(string) returns null, [, operator, value, unit] = []
                    // results in all undefined values, which makes the condition true and returns null
                    expect(result.calculus).toBeNull();
                });

                it('should return null calculus when missing value and unit', () => {
                    // Arrange
                    const value = '{{date+:yyyy-MM-dd}}';

                    // Act
                    const result = factory.getVariable(value);

                    // Assert
                    expect(result.calculus).toBeNull();
                });

                it('should return null calculus when missing operator', () => {
                    // Arrange
                    const value = '{{date2d:yyyy-MM-dd}}';

                    // Act
                    const result = factory.getVariable(value);

                    // Assert
                    expect(result.calculus).toBeNull();
                });

                it('should return null calculus when missing unit', () => {
                    // Arrange
                    const value = '{{date+2:yyyy-MM-dd}}';

                    // Act
                    const result = factory.getVariable(value);

                    // Assert
                    expect(result.calculus).toBeNull();
                });

                it('should return null calculus when missing value', () => {
                    // Arrange
                    const value = '{{date+d:yyyy-MM-dd}}';

                    // Act
                    const result = factory.getVariable(value);

                    // Assert
                    expect(result.calculus).toBeNull();
                });

                it('should return null calculus with invalid multiplication operator', () => {
                    // Arrange
                    const value = '{{date*2d:yyyy-MM-dd}}';

                    // Act
                    const result = factory.getVariable(value);

                    // Assert
                    expect(result.calculus).toBeNull();
                });

                it('should return null calculus with invalid division operator', () => {
                    // Arrange
                    const value = '{{today/5y:yyyy-MM-dd}}';

                    // Act
                    const result = factory.getVariable(value);

                    // Assert
                    expect(result.calculus).toBeNull();
                });
            });

            describe('non-numeric calculus values', () => {
                it('should return null calculus when value is alphabetic', () => {
                    // Arrange
                    const value = '{{date+abd:yyyy-MM-dd}}';

                    // Act
                    const result = factory.getVariable(value);

                    // Assert
                    expect(result.calculus).toBeNull();
                });

                it('should return null calculus when value is a word', () => {
                    // Arrange
                    const value = '{{today+twod:yyyy-MM-dd}}';

                    // Act
                    const result = factory.getVariable(value);

                    // Assert
                    expect(result.calculus).toBeNull();
                });

                it('should return null calculus when letters precede digits', () => {
                    // Arrange
                    const value = '{{date+a2d:yyyy-MM-dd}}';

                    // Act
                    const result = factory.getVariable(value);

                    // Assert
                    expect(result.calculus).toBeNull();
                });
            });

            describe('zero calculus values', () => {
                it('should correctly parse adding zero days', () => {
                    // Arrange
                    const value = '{{date+0d:yyyy-MM-dd}}';

                    // Act
                    const result = factory.getVariable(value);

                    // Assert
                    expect(result.calculus).not.toBeNull();
                    expect(result.calculus?.operator).toBe(CalculusOperator.Add);
                    expect(result.calculus?.unit).toBe('d');
                    expect(result.calculus?.value).toBe(0);
                });

                it('should correctly parse subtracting zero months', () => {
                    // Arrange
                    const value = '{{today-0m:yyyy-MM-dd}}';

                    // Act
                    const result = factory.getVariable(value);

                    // Assert
                    expect(result.calculus).not.toBeNull();
                    expect(result.calculus?.operator).toBe(CalculusOperator.Subtract);
                    expect(result.calculus?.unit).toBe('m');
                    expect(result.calculus?.value).toBe(0);
                });
            });

            describe('valid calculus returns non-null', () => {
                it('should return valid calculus object when all parts are present and valid', () => {
                    // Arrange
                    const value = '{{date+5d:yyyy-MM-dd}}';

                    // Act
                    const result = factory.getVariable(value);

                    // Assert
                    // This test is crucial for killing ConditionalExpression mutants on line 40
                    // It verifies that when operator='+ ', value='5', unit='d', and parsedValue=5 (not NaN),
                    // the condition (!operator || !value || !unit || isNaN(parsedValue)) is FALSE
                    // and a valid Calculus object is returned instead of null
                    expect(result.calculus).not.toBeNull();
                    expect(result.calculus!.operator).toBe(CalculusOperator.Add);
                    expect(result.calculus!.value).toBe(5);
                    expect(result.calculus!.unit).toBe('d');
                });

                it('should return valid calculus for subtract operation with all valid parts', () => {
                    // Arrange
                    const value = '{{today-3m:yyyy-MM-dd}}';

                    // Act
                    const result = factory.getVariable(value);

                    // Assert
                    // Another test to ensure the logical condition on line 40 correctly allows
                    // valid calculus through when ALL parts exist and are valid
                    expect(result.calculus).not.toBeNull();
                    expect(result.calculus!.operator).toBe(CalculusOperator.Subtract);
                    expect(result.calculus!.value).toBe(3);
                    expect(result.calculus!.unit).toBe('m');
                });

                it('should return valid calculus with large numeric value', () => {
                    // Arrange
                    const value = '{{date+999y:yyyy-MM-dd}}';

                    // Act
                    const result = factory.getVariable(value);

                    // Assert
                    // Tests that parseInt successfully parses the value and isNaN(parsedValue) is false
                    // helping to kill mutants that change the isNaN part of the condition
                    expect(result.calculus).not.toBeNull();
                    expect(result.calculus!.value).toBe(999);
                    expect(result.calculus!.unit).toBe('y');
                });
            });
        });
    });
});