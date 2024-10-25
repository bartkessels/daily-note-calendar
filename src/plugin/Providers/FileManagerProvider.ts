import { createContext, useContext } from "react";
import { FileManager } from "src/domain/managers/FileManager";

export const FileManagerContext = createContext<FileManager | null>(null);
export const useFileManager = (): FileManager | null => {
    return useContext(FileManagerContext);
}