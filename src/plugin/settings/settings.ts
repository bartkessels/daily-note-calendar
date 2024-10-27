import { type SettingsUiModel } from "../model/settings.ui.model";

export const dailyNoteNameSetting = (value: string): SettingsUiModel => ({
    name: 'Daily note name template',
    description: 'Format example: yyyy-MM-dd - eeee',
    placeholder: 'yyyy-MM-dd - eeee',
    value: value
});

export const dailyNoteTemplateFile = (value: string): SettingsUiModel => ({
    name: 'Daily note template',
    description: 'The template used to create the daily note',
    placeholder: 'Templates/daily-note',
    value: value
});

export const dailyNoteFolderSetting = (value: string): SettingsUiModel => ({
    name: 'Daily notes folder',
    description: 'The folder where you store your daily notes',
    placeholder: 'Daily notes',
    value: value
});

export const weeklyNoteNameTemplateSetting = (value: string): SettingsUiModel => ({
    name: 'Weekly note name template',
    description: 'Format example: yyyy - ww',
    placeholder: 'yyyy - ww',
    value: value
});

export const weeklyNoteTemplateFile = (value: string): SettingsUiModel => ({
    name: 'Weekly note template',
    description: 'The template used to create the weekly note',
    placeholder: 'Templates/weekly-note',
    value: value
});

export const weeklyNoteFolderSetting = (value: string): SettingsUiModel => ({
    name: 'Weekly notes folder',
    description: 'The folder where you store your weekly notes',
    placeholder: 'Weekly notes',
    value: value
});