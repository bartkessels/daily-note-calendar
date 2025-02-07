import {Settings} from 'src-old/domain/models/settings/settings';

export interface NotesSettings extends Settings {
    displayDateTemplate: string;
    useCreatedOnDateFromProperties: boolean;
    createdOnDatePropertyName: string;
    createdOnPropertyFormat: string;
}

export const DEFAULT_NOTES_SETTINGS: NotesSettings = {
    displayDateTemplate: 'HH:mm',
    useCreatedOnDateFromProperties: false,
    createdOnDatePropertyName: 'created_on',
    createdOnPropertyFormat: 'yyyy/MM/dd HH:mm'
}