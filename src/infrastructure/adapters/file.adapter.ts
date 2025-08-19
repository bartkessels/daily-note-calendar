export interface FileAdapter {
    exists(path: string): Promise<boolean>;
    createFile(path: string, content: string | null): Promise<string>;
    createFolder(folder: string): Promise<void>;
    readContents(path: string): Promise<string>;
    openInCurrentTab(path: string): Promise<void>;
    openInHorizontalSplitView(path: string): Promise<void>;
    openInVerticalSplitView(path: string): Promise<void>;
    delete(path: string): Promise<void>;
}