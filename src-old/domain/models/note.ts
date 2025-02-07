export interface Note {
    createdOn: Date;
    name: string;
    path: string;
    properties: Map<string, string>;
}