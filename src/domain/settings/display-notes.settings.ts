import {Settings} from 'src/domain/settings/settings';
import {SortNotes} from 'src/domain/models/note.model';

export interface DisplayNotesSettings extends Settings {
    displayDateTemplate: string;
    useCreatedOnDateFromProperties: boolean;
    createdOnDatePropertyName: string;
    createdOnPropertyFormat: string;
    sortNotes: SortNotes;
}

export const DEFAULT_DISPLAY_NOTES_SETTINGS: DisplayNotesSettings = {
    displayDateTemplate: 'HH:mm',
    useCreatedOnDateFromProperties: false,
    createdOnDatePropertyName: 'created_on',
    createdOnPropertyFormat: 'yyyy/MM/dd HH:mm',
    sortNotes: SortNotes.Ascending
}
