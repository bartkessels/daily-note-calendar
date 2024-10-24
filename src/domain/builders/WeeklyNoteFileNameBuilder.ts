export interface WeeklyNoteFileNameBuilder {
    getName(date: Date): Promise<string>
    getFullPath(date: Date): Promise<string>
}