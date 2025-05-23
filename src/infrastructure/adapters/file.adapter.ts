export interface FileAdapter {
    exists(path: string): Promise<boolean>;
    createFileFromTemplate(path: string, templatePath: string): Promise<string>;
    createFile(path: string): Promise<string>;
    createFolder(folder: string): Promise<void>;
    readContents(path: string): Promise<string>;
    writeContents(path: string, contents: string): Promise<void>;
    openInCurrentTab(path: string): Promise<void>;
    openInHorizontalSplitView(path: string): Promise<void>;
    openInVerticalSplitView(path: string): Promise<void>;
    delete(path: string): Promise<void>;
}