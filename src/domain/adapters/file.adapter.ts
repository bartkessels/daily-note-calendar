import {Note} from "src/domain/models/Note";

export interface FileAdapter {
    doesFileExist(filePath: string): Promise<boolean>;
    createFileFromTemplate(filePath: string, templateFilePath: string): Promise<string>;
    openFile(filePath: string): Promise<void>;
    getNotesCreatedOnDate(date: Date): Promise<Note[]>;
}