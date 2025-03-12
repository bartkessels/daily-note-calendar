import {Period} from 'src/domain/models/period.model';

export interface Note {
    createdOn: Period;
    name: string;
    path: string;
    properties: Map<string, string>;
}
