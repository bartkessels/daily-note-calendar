import {Period} from 'src/domain/models/period.model';

export interface Note {
    createdOn: Period;
    createdOnProperty: Period | null;
    displayDate?: string;
    name: string;
    path: string;
    properties: Map<string, string>;
}

export enum SortNotes {
    Ascending = 'ascending',
    Descending = 'descending'
}