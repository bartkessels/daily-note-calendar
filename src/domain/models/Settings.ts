export interface Settings {
    dailyNoteNameTemplate: string,
    dailyNoteTemplateFile: string,
    dailyNotesFolder: string,
    weeklyNoteNameTemplate: string,
    weeklyNoteTemplateFile: string,
    weeklyNoteFolder: string
}

export const DEFAULT_SETTINGS: Settings = {
    dailyNoteNameTemplate: 'yyyy-MM-dd - eeee',
    dailyNoteTemplateFile: 'Templates/Daily note',
    dailyNotesFolder: 'Daily notes',
    weeklyNoteNameTemplate: 'yyyy - ww',
    weeklyNoteTemplateFile: 'Templates/Weekly note',
    weeklyNoteFolder: 'Weekly notes'
}