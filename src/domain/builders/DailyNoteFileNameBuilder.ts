export interface DailyNoteFileNameBuilder {
    getName(date: Date): Promise<string>
    getFullPath(date: Date): Promise<string>
}