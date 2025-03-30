export interface FileRepository {
    exists(filePath: string): Promise<boolean>;
    create(path: string, templateFilePath?: string | null): Promise<string>;
    readContents(path: string): Promise<string>;
    writeContents(path: string, contents: string): Promise<void>;
    open(path: string): Promise<void>;
    delete(path: string): Promise<void>;
}