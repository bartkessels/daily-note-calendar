import { ModifierKey, isCreateFileModifierKey } from './modifier-key';

describe('isCreateFileModifierKey', () => {
    it('should return true for ModifierKey.Alt', () => {
        expect(isCreateFileModifierKey(ModifierKey.Alt)).toBe(true);
    });

    it('should return true for ModifierKey.Meta', () => {
        expect(isCreateFileModifierKey(ModifierKey.Meta)).toBe(true);
    });

    it('should return false for ModifierKey.None', () => {
        expect(isCreateFileModifierKey(ModifierKey.None)).toBe(false);
    });

    it('should return false for ModifierKey.Shift', () => {
        expect(isCreateFileModifierKey(ModifierKey.Shift)).toBe(false);
    });
});