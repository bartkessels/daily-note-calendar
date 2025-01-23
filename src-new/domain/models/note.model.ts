export interface Note {
    createdOn: Date;
    createdOnProperty?: Date | undefined;
    name: string;
    path: string;
    properties: Map<string, string>;
}