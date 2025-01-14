export interface CommandHandler {
    execute(): Promise<void>;
}