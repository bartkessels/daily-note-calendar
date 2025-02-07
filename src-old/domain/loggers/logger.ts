export interface Logger {
    logAndThrow(message: string): never;
}