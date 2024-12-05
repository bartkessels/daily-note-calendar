export interface FileProcessor {
    process(filePath: string): Promise<void>;
}