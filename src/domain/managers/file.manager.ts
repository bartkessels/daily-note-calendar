export interface FileManager {
    tryOpenDailyNote(date?: Date): Promise<void>;
    tryOpenWeeklyNote(date?: Date): Promise<void>;
}