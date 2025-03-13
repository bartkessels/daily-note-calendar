import {Period} from 'src/domain/models/period.model';

export interface Note {
    createdOn: Period;
    createdOnProperty: Period | null;
    name: string;
    path: string;
    properties: Map<string, string>;
}
