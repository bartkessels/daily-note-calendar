import { type SettingUiModel } from "../model/SettingUiModel";

export const dailyNoteNameSetting = (value: string): SettingUiModel => ({
    name: 'Daily note name template',
    description: 'Format example: yyyy-MM-dd - eeee',
    placeholder: 'yyyy-MM-dd - eeee',
    value: value
});

export const dailyNoteTemplateFile = (value: string): SettingUiModel => ({
    name: 'Daily note template',
    description: 'The template used to create the daily note',
    placeholder: 'Templates/daily-note',
    value: value
});

export const dailyNoteFolderSetting = (value: string): SettingUiModel => ({
    name: 'Daily notes folder',
    description: 'The folder where you store your daily notes',
    placeholder: 'Daily notes',
    value: value
});

export const weeklyNoteNameTemplateSetting = (value: string): SettingUiModel => ({
    name: 'Weekly note name template',
    description: 'Format example: yyyy - ww',
    placeholder: 'yyyy - ww',
    value: value
});

export const weeklyNoteTemplateFile = (value: string): SettingUiModel => ({
    name: 'Weekly note template',
    description: 'The template used to create the weekly note',
    placeholder: 'Templates/weekly-note',
    value: value
});

export const weeklyNoteFolderSetting = (value: string): SettingUiModel => ({
    name: 'Weekly notes folder',
    description: 'The folder where you store your weekly notes',
    placeholder: 'Weekly notes',
    value: value
});