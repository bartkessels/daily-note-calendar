import { createContext, useContext } from "react";
import { SettingsRepository } from "src/domain/repositories/SettingsRepository";

export const SettingsRepositoryContext = createContext<SettingsRepository | null>(null);
export const UseSettingsRepository = (): SettingsRepository | null => {
    return useContext(SettingsRepositoryContext);
};
