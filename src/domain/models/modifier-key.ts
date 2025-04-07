export enum ModifierKey {
    None = 0,
    Alt = 1,
    Shift = 2,
    Meta = 3,
    MetaAlt = 4
}

export function isCreateFileModifierKey(modifierKey: ModifierKey): boolean {
    return modifierKey === ModifierKey.Alt || modifierKey === ModifierKey.Meta;
}

export function isSelectModifierKey(modifierKey: ModifierKey): boolean {
    return modifierKey === ModifierKey.Shift;
}