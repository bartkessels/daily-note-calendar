import {DefaultVariableFactory} from 'src/business/factories/default.variable-factory';

describe('DefaultVariableFactory', () => {
    const factory = new DefaultVariableFactory();

    describe('getVariable', () => {
        // TODO: Check if the type is unknown

        it('should return a variable with the correct name', () => {
            // Arrange
            const value = '{{date}}';

            // Act
            const result = factory.getVariable(value);

            // Assert
            expect(result.name).toBe('date');
        });
    });
});