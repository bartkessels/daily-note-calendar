import {ModifierKey, isCreateFileModifierKey, isSelectModifierKey} from 'src/domain/models/modifier-key';

describe('ModifierKey', () => {
    describe('isCreateFileModifierKey', () => {
        it('should return false for None', () => {
            // Arrange
            const modifierKey = ModifierKey.None;

            // Act
            const result = isCreateFileModifierKey(modifierKey);

            // Assert
            expect(result).toBe(false);
        });

        it('should return true for Alt', () => {
            // Arrange
            const modifierKey = ModifierKey.Alt;

            // Act
            const result = isCreateFileModifierKey(modifierKey);

            // Assert
            expect(result).toBe(true);
        });

        it('should return false for Shift', () => {
            // Arrange
            const modifierKey = ModifierKey.Shift;

            // Act
            const result = isCreateFileModifierKey(modifierKey);

            // Assert
            expect(result).toBe(false);
        });

        it('should return true for Meta', () => {
            // Arrange
            const modifierKey = ModifierKey.Meta;

            // Act
            const result = isCreateFileModifierKey(modifierKey);

            // Assert
            expect(result).toBe(true);
        });

        it('should return false for MetaAlt', () => {
            // Arrange
            const modifierKey = ModifierKey.MetaAlt;

            // Act
            const result = isCreateFileModifierKey(modifierKey);

            // Assert
            expect(result).toBe(false);
        });
    });

    describe('isSelectModifierKey', () => {
        it('should return false for None', () => {
            // Arrange
            const modifierKey = ModifierKey.None;

            // Act
            const result = isSelectModifierKey(modifierKey);

            // Assert
            expect(result).toBe(false);
        });

        it('should return false for Alt', () => {
            // Arrange
            const modifierKey = ModifierKey.Alt;

            // Act
            const result = isSelectModifierKey(modifierKey);

            // Assert
            expect(result).toBe(false);
        });

        it('should return true for Shift', () => {
            // Arrange
            const modifierKey = ModifierKey.Shift;

            // Act
            const result = isSelectModifierKey(modifierKey);

            // Assert
            expect(result).toBe(true);
        });

        it('should return false for Meta', () => {
            // Arrange
            const modifierKey = ModifierKey.Meta;

            // Act
            const result = isSelectModifierKey(modifierKey);

            // Assert
            expect(result).toBe(false);
        });

        it('should return false for MetaAlt', () => {
            // Arrange
            const modifierKey = ModifierKey.MetaAlt;

            // Act
            const result = isSelectModifierKey(modifierKey);

            // Assert
            expect(result).toBe(false);
        });
    });
});
