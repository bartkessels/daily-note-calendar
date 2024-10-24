export interface FileService {
    tryOpenDailyNote(date: Date): Promise<void>;
    tryOpenWeeklyNote(date: Date): Promise<void>;
}