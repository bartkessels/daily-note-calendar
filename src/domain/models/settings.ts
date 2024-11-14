export interface PeriodicNoteSettings {
    nameTemplate: string,
    folder: string,
    templateFile: string
}

export interface DailyNoteSettings extends PeriodicNoteSettings {}
export interface WeeklyNoteSettings extends PeriodicNoteSettings {}
export interface MonthlyNoteSettings extends PeriodicNoteSettings {}
export interface YearlyNoteSettings extends PeriodicNoteSettings {}

export interface Settings {
    dailyNotes: DailyNoteSettings,
    weeklyNotes: WeeklyNoteSettings,
    monthlyNotes: MonthlyNoteSettings,
    yearlyNotes: YearlyNoteSettings,

    // Required for legacy reasons; todo: Remove these in the upcoming release
    dailyNoteNameTemplate: string,
    dailyNoteTemplateFile: string,
    dailyNotesFolder: string,
    weeklyNoteNameTemplate: string,
    weeklyNoteTemplateFile: string,
    weeklyNoteFolder: string
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
    },
    yearlyNotes: {
        nameTemplate: 'yyyy',
        folder: 'Yearly notes',
        templateFile: 'Templates/Yearly note'
    },

    // Required for legacy reasons; todo: Remove these in the upcoming release
    dailyNoteNameTemplate: 'yyyy-MM-dd - eeee',
    dailyNoteTemplateFile: 'Templates/Daily note',
    dailyNotesFolder: 'Daily notes',
    weeklyNoteNameTemplate: 'yyyy - ww',
    weeklyNoteTemplateFile: 'Templates/Weekly note',
    weeklyNoteFolder: 'Weekly notes'
}
