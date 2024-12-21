import {Settings} from 'src/domain/models/settings/settings';

export interface NotesSettings extends Settings {
    displayDateTemplate: string;
    useCreatedOnDateFromProperties: boolean;
    createdOnDatePropertyName: string;
}

export const DEFAULT_NOTES_SETTINGS: NotesSettings = {
    displayDateTemplate: 'HH:mm',
    useCreatedOnDateFromProperties: false,
    createdOnDatePropertyName: 'created_on'
}