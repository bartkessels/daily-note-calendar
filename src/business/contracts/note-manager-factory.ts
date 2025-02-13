import {NoteManager} from 'src/business/contracts/note.manager';

export interface NoteManagerFactory {
    getManager(): NoteManager;
}