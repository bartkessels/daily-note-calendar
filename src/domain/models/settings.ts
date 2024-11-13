export interface PeriodicNoteSettings {
    nameTemplate: string,
    folder: string,
    templateFile: string
}

export interface DailyNoteSettings extends PeriodicNoteSettings {}
export interface WeeklyNoteSettings extends PeriodicNoteSettings {}
export interface MonthlyNoteSettings extends PeriodicNoteSettings {}

export interface Settings {
    dailyNotes: DailyNoteSettings,
    weeklyNotes: WeeklyNoteSettings,
    monthlyNotes: MonthlyNoteSettings,
}

export const DEFAULT_SETTINGS: Settings = {
    dailyNotes: {
        nameTemplate: 'yyyy-MM-dd - eeee',
        folder: 'Daily notes',
        templateFile: 'Templates/Daily note'
    },
    weeklyNotes: {
        nameTemplate: 'yyyy - ww',
        folder: 'Weekly notes',
        templateFile: 'Templates/Weekly note'
    },
    monthlyNotes: {
        nameTemplate: 'yyyy-MM',
        folder: 'Monthly notes',
        templateFile: 'Templates/Monthly note'
    }
}
