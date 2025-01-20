export interface FileAdapter {
    exists(path: string): Promise<boolean>;
    create(path: string, templateFile?: string | undefined): Promise<string>;
    readContents(path: string): Promise<string>;
    writeContents(path: string, contents: string): Promise<void>;
    open(path: string): Promise<void>;
    delete(path: string): Promise<void>;
}