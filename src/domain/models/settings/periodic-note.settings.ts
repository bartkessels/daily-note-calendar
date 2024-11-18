import {Settings} from 'src/domain/models/settings/settings';

export interface PeriodicNoteSettings extends Settings {
    nameTemplate: string,
    folder: string,
    templateFile: string
}