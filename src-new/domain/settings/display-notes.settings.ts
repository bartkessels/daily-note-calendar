import {Settings} from 'src-new/domain/settings/settings';

export interface DisplayNotesSettings extends Settings {
    displayDateTemplate: string;
    useCreatedOnDateFromProperties: boolean;
    createdOnDatePropertyName: string;
    createdOnPropertyFormat: string;
}

export const DEFAULT_DISPLAY_NOTES_SETTINGS: DisplayNotesSettings = {
    displayDateTemplate: 'HH:mm',
    useCreatedOnDateFromProperties: false,
    createdOnDatePropertyName: 'created_on',
    createdOnPropertyFormat: 'yyyy/MM/dd HH:mm'
}
