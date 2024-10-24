import { createContext, useContext } from 'react';
import { FileService } from 'src/domain/services/FileService';

export const FileServiceContext = createContext<FileService | null>(null);
export const UseFileService = (): FileService | null => {
    return useContext(FileServiceContext);
};
